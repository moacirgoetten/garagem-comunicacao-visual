// ============================================================
// Garagem Comunicação Visual — dados + estado da aplicação
// ============================================================
const { useState, useCallback, useMemo, useContext, createContext, useEffect, useRef } = React;

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

// ---- formatação ----
const BRL = (n) =>
  "R$ " + Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso, days) => {
  const dt = new Date(iso + "T00:00:00");
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};

// ---- constantes de status ----
const CATEGORIAS = ["Todos", "Banner", "Cartão", "Lona", "Adesivo", "Tinta", "Panfleto", "Fachada", "Wind Banner", "Plotagem"];

const PEDIDO_STATUS = {
  novo:       { label: "Novo",                 tone: "yellow" },
  aguardando: { label: "Aguardando Orçamento", tone: "yellow-dim" },
  aprovado:   { label: "Aprovado",             tone: "green" },
  producao:   { label: "Em Produção",          tone: "blue" },
  concluido:  { label: "Concluído",            tone: "green" },
  recusado:   { label: "Recusado",             tone: "red" },
};
const ORC_STATUS = {
  gerado:   { label: "Gerado",   tone: "yellow" },
  enviado:  { label: "Enviado",  tone: "yellow-dim" },
  aprovado: { label: "Aprovado", tone: "green" },
  recusado: { label: "Recusado", tone: "red" },
};
const OS_STATUS = {
  aguardando: { label: "Aguardando",  tone: "yellow-dim" },
  producao:   { label: "Em Produção", tone: "blue" },
  concluida:  { label: "Concluída",   tone: "green" },
  entregue:   { label: "Entregue",    tone: "green" },
};

// =================== Store / Context ===================
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function useStore() {
  const [produtos,   setProdutos]   = useState([]);
  const [clientes,   setClientes]   = useState([]);
  const [pedidos,    setPedidos]    = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [ordens,     setOrdens]     = useState([]);
  const [feed,       setFeed]       = useState([]);
  const [toast,      setToast]      = useState(null);
  const [carregando, setCarregando] = useState(true);

  // ---- busca todos os dados do backend ----
  const recarregar = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dados`);
      const d = await res.json();
      setProdutos(d.produtos);
      setClientes(d.clientes);
      setPedidos(d.pedidos);
      setOrcamentos(d.orcamentos);
      setOrdens(d.ordens);
      setFeed(d.feed);
    } catch (e) {
      console.error("Erro ao conectar com o servidor:", e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { recarregar(); }, [recarregar]);

  const notify = useCallback((msg, tone = "ok") => {
    setToast({ msg, tone, key: Date.now() });
  }, []);

  // ---- lookups (computados localmente) ----
  const clienteById      = useCallback((id) => clientes.find((c) => c.id === id),  [clientes]);
  const produtoById      = useCallback((id) => produtos.find((p) => p.id === id),  [produtos]);
  const pedidoById       = useCallback((id) => pedidos.find((p) => p.id === id),   [pedidos]);

  const pedidoTotal = useCallback(
    (pedido) => pedido.itens.reduce((sum, it) => {
      const p = produtos.find((x) => x.id === it.produtoId);
      return sum + (p ? p.preco * it.qtd : 0);
    }, 0),
    [produtos]
  );
  const pedidoResumo = useCallback(
    (pedido) => pedido.itens
      .map((it) => { const p = produtos.find((x) => x.id === it.produtoId); return p ? `${it.qtd}× ${p.nome}` : ""; })
      .filter(Boolean).join("  ·  "),
    [produtos]
  );
  const numPedidosCliente = useCallback(
    (id) => pedidos.filter((p) => p.clienteId === id).length,
    [pedidos]
  );

  // ---- mutações (chamam a API e recarregam) ----

  const addProduto = useCallback(async (data) => {
    await fetch(`${API_URL}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await recarregar();
    notify("Produto salvo com sucesso");
  }, [recarregar, notify]);

  const addCliente = useCallback(async (data) => {
    await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await recarregar();
    notify("Cliente salvo com sucesso");
  }, [recarregar, notify]);

  const addPedido = useCallback(async (data) => {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const pedido = await res.json();
    await recarregar();
    notify(`Pedido ${pedido.id} registrado`);
    return pedido;
  }, [recarregar, notify]);

  // ---- INTEGRADOR: pedido -> orçamento ----
  const gerarOrcamento = useCallback(async (pedido) => {
    const res = await fetch(`${API_URL}/pedidos/${pedido.id}/orcamento`, {
      method: "POST",
    });
    const orc = await res.json();
    await recarregar();
    notify(`Orçamento ${orc.id} gerado — ${BRL(orc.total)}`);
    return orc;
  }, [recarregar, notify]);

  // ---- INTEGRADOR: orçamento aprovado -> OS ----
  const aprovarOrcamento = useCallback(async (orc) => {
    const res = await fetch(`${API_URL}/orcamentos/${orc.id}/aprovar`, {
      method: "POST",
    });
    const ordem = await res.json();
    await recarregar();
    notify(`Aprovado! Ordem de serviço ${ordem.id} criada`);
    return ordem;
  }, [recarregar, notify]);

  const recusarOrcamento = useCallback(async (orc) => {
    await fetch(`${API_URL}/orcamentos/${orc.id}/recusar`, { method: "POST" });
    await recarregar();
    notify(`Orçamento ${orc.id} recusado`, "warn");
  }, [recarregar, notify]);

  const enviarOrcamento = useCallback(async (orc) => {
    await fetch(`${API_URL}/orcamentos/${orc.id}/enviar`, { method: "POST" });
    await recarregar();
    notify(`Orçamento ${orc.id} enviado`);
  }, [recarregar, notify]);

  const deletePedido = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/pedidos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      notify(err.erro || "Erro ao excluir pedido", "warn");
      return;
    }
    await recarregar();
    notify(`Pedido ${id} excluído`, "warn");
  }, [recarregar, notify]);

  const deleteCliente = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      notify(err.erro || "Erro ao excluir cliente", "warn");
      return;
    }
    await recarregar();
    notify("Cliente excluído", "warn");
  }, [recarregar, notify]);

  // ---- OS: avançar produção ----
  const avancarOS = useCallback(async (os, delta) => {
    await fetch(`${API_URL}/ordens/${os.id}/avancar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    await recarregar();
  }, [recarregar]);

  const entregarOS = useCallback(async (os) => {
    await fetch(`${API_URL}/ordens/${os.id}/entregar`, { method: "POST" });
    await recarregar();
    notify(`${os.id} marcada como entregue`);
  }, [recarregar, notify]);

  return {
    produtos, clientes, pedidos, orcamentos, ordens, feed, toast, setToast, notify,
    carregando,
    clienteById, produtoById, pedidoById, pedidoTotal, pedidoResumo, numPedidosCliente,
    addProduto, addCliente, addPedido,
    deletePedido, deleteCliente,
    gerarOrcamento, aprovarOrcamento, recusarOrcamento, enviarOrcamento,
    avancarOS, entregarOS,
    CATEGORIAS, PEDIDO_STATUS, ORC_STATUS, OS_STATUS,
  };
}

Object.assign(window, {
  useState, useCallback, useMemo, useContext, createContext, useEffect, useRef,
  BRL, fmtDate, todayISO, addDays,
  AppCtx, useApp, useStore,
  CATEGORIAS, PEDIDO_STATUS, ORC_STATUS, OS_STATUS,
});

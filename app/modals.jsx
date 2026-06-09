// ============================================================
// Screen 7 — Modais / Formulários
// ============================================================

function ModalShell({ title, eyebrow, onClose, children, footer, width = 540 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div onMouseDown={onClose} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(5,5,5,.72)", backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 24, animation: "fadein .16s ease" }}>
      <div onMouseDown={(e) => e.stopPropagation()} className="card" style={{ width, maxWidth: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", background: "var(--surface)", borderColor: "var(--line)", boxShadow: "0 30px 90px rgba(0,0,0,.7)", animation: "pop .22s cubic-bezier(.2,.7,.2,1)", overflow: "hidden" }}>
        <div className="dotgrid" style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderLeft: "3px solid var(--yellow)" }}>
          <div>
            {eyebrow && <div className="eyebrow" style={{ marginBottom: 5 }}>{eyebrow}</div>}
            <h2 style={{ fontSize: 24, fontStyle: "italic", textTransform: "uppercase", letterSpacing: ".01em" }}>{title}</h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 5, border: "1px solid var(--line)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>✕</button>
        </div>
        <div className="modal-scroll" style={{ padding: 22, overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "16px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 10, background: "#101010" }}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children, full, error }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label className="field-label">{label}</label>
      {children}
      {error && <div style={{ color: "var(--danger)", fontSize: 11.5, marginTop: 5, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

// ---------- Produto form ----------
function ProdutoForm({ initial, onClose }) {
  const app = useApp();
  const [f, setF] = useState(initial || { nome: "", categoria: "Banner", emoji: "🚩", preco: "", unidade: "m²" });
  const [err, setErr] = useState({});
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const cats = CATEGORIAS.filter((c) => c !== "Todos");
  const unidades = ["m²", "un", "L", "veíc.", "pç", "kg", "metro"];

  const save = () => {
    const e = {};
    if (!f.nome.trim()) e.nome = "Informe o nome do produto";
    if (!f.preco || Number(f.preco) <= 0) e.preco = "Preço inválido";
    setErr(e);
    if (Object.keys(e).length) return;
    if (!initial) app.addProduto({ ...f, preco: Number(f.preco) });
    else app.notify && app.notify("Produto atualizado");
    onClose();
  };

  return (
    <ModalShell title={initial ? "Editar Produto" : "Novo Produto"} eyebrow="Cadastro · catálogo" onClose={onClose}
      footer={<><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="primary" onClick={save}>Salvar Produto</Btn></>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Nome do produto" full error={err.nome}>
          <input className={`input${err.nome ? " is-error" : ""}`} value={f.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: Banner Lona 440g" autoFocus />
        </Field>
        <Field label="Categoria">
          <select className="input" value={f.categoria} onChange={(e) => set("categoria", e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Unidade">
          <select className="input" value={f.unidade} onChange={(e) => set("unidade", e.target.value)}>
            {unidades.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Preço (R$)" error={err.preco}>
          <input className={`input${err.preco ? " is-error" : ""}`} type="number" step="0.01" value={f.preco} onChange={(e) => set("preco", e.target.value)} placeholder="0,00" />
        </Field>
        <Field label="Ícone (emoji)">
          <input className="input" value={f.emoji} onChange={(e) => set("emoji", e.target.value)} maxLength={2} style={{ fontSize: 18 }} />
        </Field>
      </div>
    </ModalShell>
  );
}

// ---------- Cliente form ----------
function ClienteForm({ onClose }) {
  const app = useApp();
  const [f, setF] = useState({ nome: "", tipo: "PJ", documento: "", telefone: "" });
  const [err, setErr] = useState({});
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const save = () => {
    const e = {};
    if (!f.nome.trim()) e.nome = f.tipo === "PJ" ? "Informe a razão social" : "Informe o nome";
    if (!f.documento.trim()) e.documento = f.tipo === "PJ" ? "CNPJ obrigatório" : "CPF obrigatório";
    setErr(e);
    if (Object.keys(e).length) return;
    app.addCliente(f);
    onClose();
  };

  return (
    <ModalShell title="Novo Cliente" eyebrow="Cadastro · clientes" onClose={onClose}
      footer={<><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="primary" onClick={save}>Salvar Cliente</Btn></>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Tipo de cliente" full>
          <div style={{ display: "flex", gap: 10 }}>
            {["PJ", "PF"].map((t) => (
              <button key={t} onClick={() => set("tipo", t)} className="cond" style={{ flex: 1, height: 42, borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: ".05em", border: f.tipo === t ? "1px solid var(--yellow)" : "1px solid var(--line)", background: f.tipo === t ? "rgba(245,200,0,.12)" : "var(--input)", color: f.tipo === t ? "var(--yellow)" : "var(--muted)" }}>
                {t === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}
              </button>
            ))}
          </div>
        </Field>
        <Field label={f.tipo === "PJ" ? "Razão social" : "Nome completo"} full error={err.nome}>
          <input className={`input${err.nome ? " is-error" : ""}`} value={f.nome} onChange={(e) => set("nome", e.target.value)} placeholder={f.tipo === "PJ" ? "Ex.: Padaria Pão Quente Ltda" : "Ex.: Marcos Andrade"} autoFocus />
        </Field>
        <Field label={f.tipo === "PJ" ? "CNPJ" : "CPF"} error={err.documento}>
          <input className={`input${err.documento ? " is-error" : ""}`} value={f.documento} onChange={(e) => set("documento", e.target.value)} placeholder={f.tipo === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"} />
        </Field>
        <Field label="Telefone">
          <input className="input" value={f.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="(41) 90000-0000" />
        </Field>
      </div>
    </ModalShell>
  );
}

// ---------- Pedido form ----------
function PedidoForm({ onClose }) {
  const app = useApp();
  const [clienteId, setClienteId] = useState(app.clientes[0] ? app.clientes[0].id : "");
  const [prazo, setPrazo] = useState(addDays(todayISO(), 7));
  const [itens, setItens] = useState([{ produtoId: app.produtos[0] ? app.produtos[0].id : "", qtd: 1 }]);
  const [err, setErr] = useState({});

  const setItem = (i, k, v) => setItens((arr) => arr.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const addItem = () => setItens((arr) => [...arr, { produtoId: app.produtos[0].id, qtd: 1 }]);
  const rmItem = (i) => setItens((arr) => arr.filter((_, idx) => idx !== i));

  const total = itens.reduce((s, it) => {
    const p = app.produtoById(it.produtoId);
    return s + (p ? p.preco * Number(it.qtd || 0) : 0);
  }, 0);

  const save = () => {
    const e = {};
    if (!clienteId) e.cliente = "Selecione um cliente";
    if (!itens.length || itens.some((it) => !it.produtoId || Number(it.qtd) <= 0)) e.itens = "Adicione ao menos um item válido";
    setErr(e);
    if (Object.keys(e).length) return;
    app.addPedido({ clienteId, prazo, itens: itens.map((it) => ({ produtoId: it.produtoId, qtd: Number(it.qtd) })) });
    onClose();
  };

  return (
    <ModalShell title="Novo Pedido" eyebrow="Registro · pedidos" onClose={onClose} width={620}
      footer={
        <>
          <div style={{ marginRight: "auto", display: "flex", alignItems: "baseline", gap: 9 }}>
            <span className="eyebrow">Estimativa</span>
            <span className="cond yellow" style={{ fontSize: 22, fontWeight: 800, fontStyle: "italic" }}>{BRL(total)}</span>
          </div>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={save}>Registrar Pedido</Btn>
        </>
      }>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Field label="Cliente" error={err.cliente}>
          <select className="input" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            {app.clientes.map((c) => <option key={c.id} value={c.id}>{c.nome} · {c.tipo}</option>)}
          </select>
        </Field>
        <Field label="Prazo de entrega">
          <input className="input" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
        </Field>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <label className="field-label" style={{ marginBottom: 0 }}>Itens do pedido</label>
        <button onClick={addItem} className="cond" style={{ background: "none", border: "1px solid var(--line)", borderRadius: 5, color: "var(--yellow)", cursor: "pointer", padding: "5px 11px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>＋ Item</button>
      </div>
      {err.itens && <div style={{ color: "var(--danger)", fontSize: 11.5, marginBottom: 8 }}>{err.itens}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {itens.map((it, i) => {
          const p = app.produtoById(it.produtoId);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 88px 96px 32px", gap: 9, alignItems: "center", background: "var(--input)", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 10px" }}>
              <select className="input" style={{ height: 36, background: "#161616" }} value={it.produtoId} onChange={(e) => setItem(i, "produtoId", e.target.value)}>
                {app.produtos.map((pr) => <option key={pr.id} value={pr.id}>{pr.emoji} {pr.nome}</option>)}
              </select>
              <input className="input" style={{ height: 36, background: "#161616", textAlign: "center" }} type="number" min="1" value={it.qtd} onChange={(e) => setItem(i, "qtd", e.target.value)} />
              <div className="cond yellow" style={{ fontSize: 14, fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{BRL(p ? p.preco * Number(it.qtd || 0) : 0)}</div>
              <button onClick={() => rmItem(i)} disabled={itens.length === 1} style={{ width: 30, height: 30, borderRadius: 5, border: "1px solid var(--line)", background: "transparent", color: itens.length === 1 ? "var(--muted-2)" : "var(--danger)", cursor: itens.length === 1 ? "not-allowed" : "pointer", fontSize: 14 }}>✕</button>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}

Object.assign(window, { ModalShell, Field, ProdutoForm, ClienteForm, PedidoForm });

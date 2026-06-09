// ============================================================
// Screen 4 — Pedidos
// ============================================================

function Pedidos({ openModal, onNavigate, focusOrcamento }) {
  const app = useApp();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Todos");

  const statusFilters = ["Todos", "novo", "aguardando", "aprovado", "producao", "concluido", "recusado"];

  const filtered = app.pedidos.filter((p) => {
    const cli = app.clienteById(p.clienteId);
    const okStatus = status === "Todos" || p.status === status;
    const okQ = !q || p.id.toLowerCase().includes(q.toLowerCase()) || (cli && cli.nome.toLowerCase().includes(q.toLowerCase()));
    return okStatus && okQ;
  });

  const handleGerar = async (p) => {
    const orc = await app.gerarOrcamento(p);
    setTimeout(() => onNavigate("orcamentos", { focus: orc.id }), 350);
  };

  return (
    <div className="screen-enter">
      <PageHead eyebrow="Registro de pedidos" title="Pedidos">
        <Search value={q} onChange={setQ} placeholder="# ou cliente..." />
        <Btn variant="primary" icon="＋" onClick={() => openModal("pedido")}>Novo Pedido</Btn>
      </PageHead>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {statusFilters.map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
            {s === "Todos" ? "Todos" : PEDIDO_STATUS[s].label}
          </FilterChip>
        ))}
      </div>

      <Panel pad={false}>
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Produto(s)</th><th style={{ textAlign: "center" }}>Itens</th><th>Prazo</th><th>Status</th><th style={{ textAlign: "right" }}>Ação</th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cli = app.clienteById(p.clienteId);
              const qtdItens = p.itens.reduce((s, it) => s + 1, 0);
              const hasOrc = app.orcamentos.find((o) => o.pedidoId === p.id);
              const os = app.ordens.find((o) => o.pedidoId === p.id);
              return (
                <tr key={p.id}>
                  <td className="num yellow" style={{ fontSize: 14 }}>{p.id}</td>
                  <td><ClientCell cliente={cli} /></td>
                  <td className="muted" style={{ maxWidth: 260, fontSize: 13 }}>{app.pedidoResumo(p)}</td>
                  <td style={{ textAlign: "center" }} className="num">{qtdItens}</td>
                  <td className="num" style={{ fontSize: 13 }}>{fmtDate(p.prazo)}</td>
                  <td><StatusBadge map={PEDIDO_STATUS} value={p.status} /></td>
                  <td style={{ textAlign: "right" }}>
                    {p.status === "novo" && <Btn size="sm" variant="primary" onClick={() => handleGerar(p)}>Gerar Orç.</Btn>}
                    {p.status === "aguardando" && hasOrc && <Btn size="sm" variant="ghost" onClick={() => onNavigate("orcamentos", { focus: hasOrc.id })}>Ver Orç.</Btn>}
                    {(p.status === "aprovado" || p.status === "producao" || p.status === "concluido") && os && <Btn size="sm" variant="ghost" onClick={() => onNavigate("ordens")}>Ver OS</Btn>}
                    {p.status === "recusado" && <span className="muted cond" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em" }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon="▤" title="Nenhum pedido" sub="Ajuste o filtro ou registre um novo pedido." />}
      </Panel>
    </div>
  );
}

Object.assign(window, { Pedidos });

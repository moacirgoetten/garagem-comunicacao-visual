// ============================================================
// Screen 5 — Orçamentos (INTEGRADOR)
// ============================================================

const FLOW_STEPS = [
  { key: "pedido", label: "Pedido Recebido", icon: "▤" },
  { key: "orcamento", label: "Orçamento Gerado", icon: "⇄" },
  { key: "aprovacao", label: "Aprovação", icon: "✓" },
  { key: "os", label: "Ordem de Serviço", icon: "⚙" },
];

function FlowStepper({ active = 1 }) {
  return (
    <div className="card" style={{ padding: "20px 24px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
      <div className="dotgrid" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {FLOW_STEPS.map((s, i) => {
          const done = i < active;
          const isActive = i === active;
          const color = done || isActive ? "var(--yellow)" : "var(--muted-2)";
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 13, flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0,
                  background: isActive ? "var(--yellow)" : done ? "rgba(245,200,0,.12)" : "#0e0e0d",
                  border: isActive ? "1px solid var(--yellow)" : done ? "1px solid rgba(245,200,0,.4)" : "1px solid var(--line)",
                  boxShadow: isActive ? "0 0 0 4px rgba(245,200,0,.16)" : "none",
                }}>
                  <span style={{ fontSize: 18, color: isActive ? "#0a0a0a" : color }}>{done ? "✓" : s.icon}</span>
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: 9, color: "var(--muted-2)", marginBottom: 2 }}>Etapa {i + 1}</div>
                  <div className="cond" style={{ fontSize: 15, fontWeight: 700, color: done || isActive ? "var(--text)" : "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em", fontStyle: isActive ? "italic" : "normal", whiteSpace: "nowrap" }}>{s.label}</div>
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: "0 16px", background: i < active ? "var(--yellow)" : "var(--line)", borderRadius: 2, minWidth: 24, opacity: i < active ? 0.6 : 1 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function Orcamentos({ onNavigate, params }) {
  const app = useApp();
  const [q, setQ] = useState("");
  const [focusId, setFocusId] = useState(params && params.focus);

  useEffect(() => { if (params && params.focus) { setFocusId(params.focus); const t = setTimeout(() => setFocusId(null), 2400); return () => clearTimeout(t); } }, [params]);

  // determine active step from current orçamentos state
  const anyAprovado = app.orcamentos.some((o) => o.status === "aprovado");
  const anyGerado = app.orcamentos.some((o) => o.status === "gerado" || o.status === "enviado");
  const activeStep = anyAprovado ? 3 : anyGerado ? 1 : 1;

  const filtered = app.orcamentos.filter((o) => {
    const cli = app.clienteById(o.clienteId);
    return !q || o.id.toLowerCase().includes(q.toLowerCase()) || o.pedidoId.toLowerCase().includes(q.toLowerCase()) || (cli && cli.nome.toLowerCase().includes(q.toLowerCase()));
  });

  const handleAprovar = (o) => {
    app.aprovarOrcamento(o);
    setTimeout(() => onNavigate("ordens"), 400);
  };

  return (
    <div className="screen-enter">
      <PageHead eyebrow="Integrador · fluxo de produção" title="Orçamentos">
        <Search value={q} onChange={setQ} placeholder="Orçamento, pedido ou cliente..." />
      </PageHead>

      <FlowStepper active={activeStep} />

      <Panel pad={false} title="Orçamentos Gerados">
        <table className="tbl">
          <thead>
            <tr><th>Orçamento</th><th>Pedido</th><th>Cliente</th><th style={{ textAlign: "right" }}>Valor Total</th><th>Validade</th><th>Status</th><th style={{ textAlign: "right" }}>Ação</th></tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const cli = app.clienteById(o.clienteId);
              const isFocus = focusId === o.id;
              return (
                <tr key={o.id} className={isFocus ? "is-selected" : ""} style={isFocus ? { boxShadow: "inset 0 0 0 1px rgba(245,200,0,.3)" } : undefined}>
                  <td className="num yellow" style={{ fontSize: 14 }}>{o.id}</td>
                  <td className="num muted" style={{ fontSize: 13 }}>{o.pedidoId}</td>
                  <td><ClientCell cliente={cli} /></td>
                  <td style={{ textAlign: "right" }}><span className="cond yellow" style={{ fontSize: 18, fontWeight: 800, fontStyle: "italic", fontVariantNumeric: "tabular-nums" }}>{BRL(o.total)}</span></td>
                  <td className="num" style={{ fontSize: 13 }}>{fmtDate(o.validade)}</td>
                  <td><StatusBadge map={ORC_STATUS} value={o.status} /></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {(o.status === "gerado" || o.status === "enviado") && (
                      <div style={{ display: "inline-flex", gap: 7 }}>
                        <Btn size="sm" variant="success" onClick={() => handleAprovar(o)}>Aprovar</Btn>
                        <Btn size="sm" variant="danger-ghost" onClick={() => app.recusarOrcamento(o)}>Recusar</Btn>
                      </div>
                    )}
                    {o.status === "aprovado" && <Btn size="sm" variant="ghost" onClick={() => onNavigate("ordens")}>Ver OS</Btn>}
                    {o.status === "recusado" && <span className="muted cond" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em" }}>Encerrado</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon="⇄" title="Nenhum orçamento" sub="Gere um orçamento a partir de um pedido novo." />}
      </Panel>
    </div>
  );
}

Object.assign(window, { Orcamentos, FlowStepper });

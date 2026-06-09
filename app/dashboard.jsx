// ============================================================
// Screen 1 — Dashboard
// ============================================================

function ActivityIcon({ tipo }) {
  const map = {
    os: { ic: "⚙", color: "var(--info)" },
    orc: { ic: "⇄", color: "var(--yellow)" },
    pedido: { ic: "▤", color: "var(--yellow)" },
    cliente: { ic: "◑", color: "var(--muted)" },
    produto: { ic: "▦", color: "var(--success)" },
  };
  const m = map[tipo] || map.pedido;
  return (
    <div style={{ width: 28, height: 28, borderRadius: 5, display: "grid", placeItems: "center", background: "#0e0e0d", border: "1px solid var(--line)", flexShrink: 0 }}>
      <span style={{ fontSize: 13, color: m.color }}>{m.ic}</span>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const app = useApp();
  const ativos = app.pedidos.filter((p) => !["concluido", "recusado"].includes(p.status)).length;
  const orcPend = app.orcamentos.filter((o) => o.status === "gerado" || o.status === "enviado").length;
  const osProd = app.ordens.filter((o) => o.status === "producao" || o.status === "aguardando").length;
  const recentes = app.pedidos.slice(0, 6);

  return (
    <div className="screen-enter">
      <PageHead eyebrow="Painel de operação" title="Dashboard">
        <Btn variant="ghost" size="sm">Hoje · {fmtDate(todayISO())}</Btn>
        <Btn variant="primary" icon="＋" onClick={() => onNavigate("pedidos", { newOrder: true })}>Novo Pedido</Btn>
      </PageHead>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
        <StatCard label="Pedidos Ativos" value={ativos} sub="Em aberto no fluxo" trend="↑ 3 nesta semana" />
        <StatCard label="Orçamentos Pendentes" value={orcPend} sub="Aguardando aprovação" tone="yellow" />
        <StatCard label="OS em Produção" value={osProd} sub="Na bancada agora" tone="blue" />
        <StatCard label="Clientes" value={app.clientes.length} sub={`${app.clientes.filter((c) => c.tipo === "PJ").length} PJ · ${app.clientes.filter((c) => c.tipo === "PF").length} PF`} tone="green" />
      </div>

      {/* main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>
        {/* recent orders */}
        <Panel
          title="Pedidos Recentes"
          action={<button onClick={() => onNavigate("pedidos")} className="cond" style={{ background: "none", border: "none", color: "var(--yellow)", cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: ".05em" }}>Ver todos →</button>}
        >
          <table className="tbl">
            <thead>
              <tr><th>#</th><th>Cliente</th><th>Produto(s)</th><th>Prazo</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentes.map((p) => {
                const cli = app.clienteById(p.clienteId);
                return (
                  <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => onNavigate("pedidos")}>
                    <td className="num yellow" style={{ fontSize: 14 }}>{p.id}</td>
                    <td><ClientCell cliente={cli} /></td>
                    <td className="muted" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{app.pedidoResumo(p)}</td>
                    <td className="num" style={{ fontSize: 13 }}>{fmtDate(p.prazo)}</td>
                    <td><StatusBadge map={PEDIDO_STATUS} value={p.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        {/* activity feed */}
        <Panel title="Atividade">
          <div style={{ padding: "6px 0" }}>
            {app.feed.map((f, i) => (
              <div key={f.id} style={{ display: "flex", gap: 11, padding: "11px 18px", borderBottom: i < app.feed.length - 1 ? "1px solid var(--line-soft)" : "none", animation: i === 0 ? "slidein .3s ease" : undefined }}>
                <ActivityIcon tipo={f.tipo} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.35 }}>{f.txt}</div>
                  <div className="eyebrow" style={{ fontSize: 9.5, marginTop: 3, letterSpacing: ".1em", color: "var(--muted-2)" }}>{f.quando}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });

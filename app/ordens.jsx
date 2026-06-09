// ============================================================
// Screen 6 — Ordens de Serviço
// ============================================================

function OSCard({ os }) {
  const app = useApp();
  const cli = app.clienteById(os.clienteId);
  const concluida = os.status === "concluida" || os.status === "entregue";
  return (
    <div className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 20, borderLeft: "3px solid var(--yellow)" }}>
      {/* id block */}
      <div style={{ minWidth: 108, flexShrink: 0 }}>
        <div className="cond yellow" style={{ fontSize: 22, fontWeight: 800, fontStyle: "italic", lineHeight: 1 }}>{os.id}</div>
        <div className="eyebrow" style={{ fontSize: 9, color: "var(--muted-2)", marginTop: 4 }}>Aberta {fmtDate(os.criado)}</div>
      </div>

      {/* client + descr */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
          <ClientCell cliente={cli} />
        </div>
        <div className="muted" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 41 }}>{os.descricao}</div>
      </div>

      {/* progress */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <ProgressBar value={os.progresso} />
          <span className="cond" style={{ fontSize: 16, fontWeight: 800, fontStyle: "italic", color: concluida ? "var(--success)" : "var(--yellow)", minWidth: 42, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{os.progresso}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StatusBadge map={OS_STATUS} value={os.status} />
          {!concluida ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => app.avancarOS(os, -25)} title="Recuar" className="cond" style={{ width: 26, height: 26, borderRadius: 4, border: "1px solid var(--line)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>−</button>
              <button onClick={() => app.avancarOS(os, 25)} title="Avançar" className="cond" style={{ width: 26, height: 26, borderRadius: 4, border: "1px solid var(--yellow)", background: "rgba(245,200,0,.1)", color: "var(--yellow)", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>+</button>
            </div>
          ) : os.status === "concluida" ? (
            <Btn size="sm" variant="success" onClick={() => app.entregarOS(os)}>Entregar</Btn>
          ) : (
            <span className="cond" style={{ fontSize: 12, color: "var(--success)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>✓ Entregue</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Ordens() {
  const app = useApp();
  const [filter, setFilter] = useState("Todas");

  const c = {
    aguardando: app.ordens.filter((o) => o.status === "aguardando").length,
    producao: app.ordens.filter((o) => o.status === "producao").length,
    concluida: app.ordens.filter((o) => o.status === "concluida").length,
    entregue: app.ordens.filter((o) => o.status === "entregue").length,
  };

  const filterMap = { Todas: null, Aguardando: "aguardando", "Em Produção": "producao", Concluídas: "concluida", Entregues: "entregue" };
  const filtered = app.ordens.filter((o) => !filterMap[filter] || o.status === filterMap[filter]);

  return (
    <div className="screen-enter">
      <PageHead eyebrow="Produção · chão de fábrica" title="Ordens de Serviço" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        <MiniStat label="Aguardando" value={c.aguardando} tone="yellow-dim" />
        <MiniStat label="Em Produção" value={c.producao} tone="blue" />
        <MiniStat label="Concluídas" value={c.concluida} tone="green" />
        <MiniStat label="Entregues" value={c.entregue} tone="green" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.keys(filterMap).map((f) => (
          <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</FilterChip>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="card"><EmptyState icon="⚙" title="Nenhuma OS" sub="Aprove um orçamento para gerar uma ordem de serviço." /></div>
        ) : (
          filtered.map((os) => <OSCard key={os.id} os={os} />)
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Ordens });

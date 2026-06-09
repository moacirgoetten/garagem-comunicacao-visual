// ============================================================
// Sidebar
// ============================================================

const NAV = [
  { section: null, items: [{ id: "dashboard", label: "Dashboard", icon: "◧" }] },
  { section: "Cadastros", items: [
    { id: "produtos", label: "Produtos", icon: "▦" },
    { id: "clientes", label: "Clientes", icon: "◑" },
    { id: "pedidos", label: "Pedidos", icon: "▤" },
  ]},
  { section: "Integrador", items: [
    { id: "orcamentos", label: "Orçamentos", icon: "⇄" },
    { id: "ordens", label: "Ordens de Serviço", icon: "⚙" },
  ]},
  { section: "Sistema", items: [
    { id: "componentes", label: "Componentes", icon: "◆" },
  ]},
];

function NavItem({ item, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative", width: "100%", textAlign: "left", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 10px 18px",
        background: active ? "rgba(245,200,0,.08)" : "transparent",
        border: "none", borderLeft: active ? "3px solid var(--yellow)" : "3px solid transparent",
        color: active ? "var(--yellow)" : "var(--muted)",
        fontFamily: "var(--head)", fontSize: 15, fontWeight: active ? 700 : 500,
        letterSpacing: ".02em", transition: "all .14s",
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "#0e0e0d"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; } }}
    >
      <span style={{ width: 18, textAlign: "center", fontSize: 15, opacity: active ? 1 : 0.75 }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {badge != null && badge > 0 && (
        <span className="cond" style={{ fontSize: 11, fontWeight: 700, minWidth: 20, height: 18, padding: "0 5px", borderRadius: 4, display: "grid", placeItems: "center", background: active ? "var(--yellow)" : "rgba(136,136,128,.18)", color: active ? "#0a0a0a" : "var(--muted)" }}>{badge}</span>
      )}
    </button>
  );
}

function Sidebar({ route, onNavigate }) {
  const app = useApp();
  const counts = {
    pedidos: app.pedidos.filter((p) => p.status === "novo" || p.status === "aguardando").length,
    orcamentos: app.orcamentos.filter((o) => o.status === "gerado" || o.status === "enviado").length,
    ordens: app.ordens.filter((o) => o.status === "producao" || o.status === "aguardando").length,
  };

  return (
    <aside style={{ width: "var(--sidebar-w)", background: "var(--sidebar)", borderRight: "1px solid var(--line-soft)", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh" }}>
      {/* logo lockup */}
      <div style={{ padding: "20px 18px 18px", borderBottom: "1px solid var(--line-soft)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ width: 7, height: 7, background: "var(--yellow)", borderRadius: 1 }} />
          <span className="eyebrow" style={{ fontSize: 9.5, color: "var(--muted)", letterSpacing: ".18em" }}>Sistema de Gestão</span>
        </div>
        <div className="cond" style={{ fontSize: 38, fontWeight: 800, fontStyle: "italic", color: "var(--yellow)", lineHeight: 0.82, letterSpacing: "-.01em" }}>Garagem</div>
        <div className="cond" style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".26em", marginTop: 7 }}>Comunicação Visual</div>
      </div>

      {/* nav */}
      <nav style={{ flex: 1, overflowY: "auto", paddingTop: 10, paddingBottom: 10 }}>
        {NAV.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 6 }}>
            {group.section && (
              <div className="eyebrow" style={{ padding: "12px 18px 6px", fontSize: 9.5, letterSpacing: ".2em", color: "var(--muted-2)" }}>{group.section}</div>
            )}
            {group.items.map((item) => (
              <NavItem key={item.id} item={item} active={route === item.id} badge={counts[item.id]} onClick={() => onNavigate(item.id)} />
            ))}
          </div>
        ))}
      </nav>

      {/* contact footer */}
      <div style={{ borderTop: "1px solid var(--line-soft)", padding: "14px 18px 10px" }}>
        <div className="eyebrow" style={{ fontSize: 9, letterSpacing: ".2em", marginBottom: 9, color: "var(--muted-2)" }}>Contato</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8, fontSize: 13, color: "var(--muted)" }}>
          <span style={{ color: "var(--yellow)", fontSize: 13 }}>✆</span>
          <span style={{ fontFamily: "var(--head)", fontWeight: 500, letterSpacing: ".02em" }}>41 99267-5409</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--muted)" }}>
          <span style={{ color: "var(--yellow)", fontSize: 13 }}>◎</span>
          <span style={{ fontFamily: "var(--head)", fontWeight: 500, letterSpacing: ".01em" }}>@garagemcomunicacaovisual</span>
        </div>
      </div>

      {/* user chip */}
      <div style={{ borderTop: "1px solid var(--line-soft)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 34, height: 34, borderRadius: 6, background: "var(--yellow)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <span className="cond" style={{ fontSize: 15, fontWeight: 800, color: "#0a0a0a", fontStyle: "italic" }}>RG</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="cond" style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Rodrigo Garagem</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Administrador</div>
        </div>
        <span style={{ color: "var(--muted-2)", fontSize: 13 }}>⋯</span>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar, NAV });

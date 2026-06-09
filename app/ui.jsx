// ============================================================
// UI kit compartilhado
// ============================================================

function Badge({ tone = "gray", children, dot = false }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="dot" style={{ background: "currentColor" }} />}
      {children}
    </span>
  );
}

function StatusBadge({ map, value }) {
  const s = map[value] || { label: value, tone: "gray" };
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
}

function Btn({ variant = "ghost", size, children, icon, ...rest }) {
  const cls = `btn btn-${variant}${size === "sm" ? " btn-sm" : ""}`;
  return (
    <button className={cls} {...rest}>
      {icon && <span style={{ fontSize: size === "sm" ? 13 : 15, lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  );
}

// stat card with yellow left accent
function StatCard({ label, value, sub, accent = true, tone = "yellow", trend }) {
  const toneColor = { yellow: "var(--yellow)", green: "var(--success)", blue: "var(--info)", red: "var(--danger)" }[tone];
  return (
    <div className="card" style={{ borderLeft: accent ? `3px solid ${toneColor}` : undefined, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
      <div className="dotgrid" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ position: "relative" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
        <div className="cond" style={{ fontSize: 40, fontWeight: 700, lineHeight: 0.95, fontStyle: "italic", color: tone === "yellow" ? "var(--text)" : toneColor, fontVariantNumeric: "tabular-nums" }}>{value}</div>
        {sub && <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>{sub}</div>}
        {trend && <div style={{ fontSize: 12, marginTop: 6, color: toneColor, fontWeight: 600 }}>{trend}</div>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone = "yellow", active }) {
  const toneColor = { yellow: "var(--yellow)", "yellow-dim": "#b8a23a", green: "var(--success)", blue: "var(--info)", red: "var(--danger)" }[tone];
  return (
    <div className="card" style={{ padding: "14px 16px", borderLeft: `3px solid ${toneColor}`, display: "flex", flexDirection: "column", gap: 2 }}>
      <div className="cond" style={{ fontSize: 30, fontWeight: 700, fontStyle: "italic", color: toneColor, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div className="eyebrow" style={{ fontSize: 10 }}>{label}</div>
    </div>
  );
}

function ProgressBar({ value, height = 8 }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ background: "#0e0e0e", border: "1px solid var(--line)", borderRadius: 4, height, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${v}%`, height: "100%", background: v >= 100 ? "var(--success)" : "var(--yellow)", transition: "width .35s cubic-bezier(.2,.7,.2,1)", boxShadow: v >= 100 ? "none" : "0 0 8px rgba(245,200,0,.4)" }} />
    </div>
  );
}

// page header used across screens
function PageHead({ eyebrow, title, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <h1 style={{ fontSize: 34, fontStyle: "italic", textTransform: "uppercase", letterSpacing: ".01em" }}>{title}</h1>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{children}</div>
    </div>
  );
}

// search input
function Search({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
      <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)", fontSize: 14, pointerEvents: "none" }}>⌕</span>
      <input className="input" style={{ paddingLeft: 34, height: 40 }} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// chip-style filter
function FilterChip({ active, children, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="cond"
      style={{
        textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, fontSize: 12.5,
        padding: "7px 13px", borderRadius: 5, cursor: "pointer", whiteSpace: "nowrap",
        border: active ? "1px solid var(--yellow)" : "1px solid var(--line)",
        background: active ? "rgba(245,200,0,.12)" : "transparent",
        color: active ? "var(--yellow)" : "var(--muted)",
        transition: "all .14s", display: "inline-flex", alignItems: "center", gap: 7,
      }}
    >
      {children}
      {count != null && <span style={{ fontSize: 11, opacity: 0.7 }}>{count}</span>}
    </button>
  );
}

function EmptyState({ icon = "∅", title, sub }) {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--muted)" }}>
      <div style={{ fontSize: 34, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
      <div className="cond" style={{ fontSize: 18, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text)", marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  );
}

// section card wrapper with header
function Panel({ title, action, children, pad = true, style }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderBottom: "1px solid var(--line-soft)" }}>
          <div className="cond" style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", fontStyle: "italic" }}>{title}</div>
          {action}
        </div>
      )}
      <div style={{ padding: pad ? 0 : 0, flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

// avatar / client cell
function ClientCell({ cliente }) {
  if (!cliente) return <span className="muted">—</span>;
  const initials = cliente.nome.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <div style={{ width: 30, height: 30, borderRadius: 5, background: cliente.tipo === "PJ" ? "rgba(245,200,0,.14)" : "rgba(136,136,128,.14)", border: cliente.tipo === "PJ" ? "1px solid rgba(245,200,0,.3)" : "1px solid var(--line)", display: "grid", placeItems: "center", flexShrink: 0 }}>
        <span className="cond" style={{ fontSize: 12, fontWeight: 700, color: cliente.tipo === "PJ" ? "var(--yellow)" : "var(--muted)" }}>{initials}</span>
      </div>
      <span style={{ fontWeight: 500 }}>{cliente.nome}</span>
    </div>
  );
}

// toast
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  const color = toast.tone === "warn" ? "var(--danger)" : "var(--success)";
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "var(--surface-2)", border: "1px solid var(--line)", borderLeft: `3px solid ${color}`, borderRadius: 7, padding: "13px 18px", display: "flex", alignItems: "center", gap: 11, boxShadow: "0 14px 40px rgba(0,0,0,.6)", animation: "pop .22s ease" }}>
      <span style={{ color, fontSize: 15 }}>{toast.tone === "warn" ? "⚠" : "✓"}</span>
      <span className="cond" style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".01em" }}>{toast.msg}</span>
    </div>
  );
}

Object.assign(window, {
  Badge, StatusBadge, Btn, StatCard, MiniStat, ProgressBar, PageHead,
  Search, FilterChip, EmptyState, Panel, ClientCell, Toast,
});

// ============================================================
// Screen 2 — Produtos
// ============================================================

function ProdutoCard({ p, onEdit }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: 0, overflow: "hidden", transition: "transform .12s, border-color .15s", transform: hover ? "translateY(-2px)" : "none", borderColor: hover ? "#34342f" : "var(--line-soft)", cursor: "default" }}
    >
      <div className="dotgrid" style={{ height: 92, background: "#0f0f0e", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--line-soft)", position: "relative" }}>
        <span style={{ fontSize: 40, filter: "grayscale(.15)" }}>{p.emoji}</span>
        <div style={{ position: "absolute", top: 10, left: 10 }}><Badge tone="gray">{p.categoria}</Badge></div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div className="cond" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.1, marginBottom: 4, letterSpacing: ".005em" }}>{p.nome}</div>
        <div className="eyebrow" style={{ fontSize: 9.5, color: "var(--muted-2)", marginBottom: 12 }}>Cód. {p.id}</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <span className="cond yellow" style={{ fontSize: 24, fontWeight: 800, fontStyle: "italic", fontVariantNumeric: "tabular-nums" }}>{BRL(p.preco)}</span>
            <span className="muted cond" style={{ fontSize: 13, marginLeft: 5, fontWeight: 500 }}>/ {p.unidade}</span>
          </div>
          <button onClick={() => onEdit(p)} className="cond" style={{ background: "none", border: "1px solid var(--line)", borderRadius: 5, color: "var(--muted)", cursor: "pointer", padding: "5px 10px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", opacity: hover ? 1 : 0.6, transition: "opacity .15s" }}>Editar</button>
        </div>
      </div>
    </div>
  );
}

function Produtos({ openModal }) {
  const app = useApp();
  const [cat, setCat] = useState("Todos");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const m = { Todos: app.produtos.length };
    app.produtos.forEach((p) => { m[p.categoria] = (m[p.categoria] || 0) + 1; });
    return m;
  }, [app.produtos]);

  const filtered = app.produtos.filter((p) => {
    const okCat = cat === "Todos" || p.categoria === cat;
    const okQ = !q || p.nome.toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <div className="screen-enter">
      <PageHead eyebrow="Catálogo de insumos & serviços" title="Produtos">
        <Search value={q} onChange={setQ} placeholder="Buscar produto..." />
        <Btn variant="primary" icon="＋" onClick={() => openModal("produto")}>Novo Produto</Btn>
      </PageHead>

      {/* filter bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {CATEGORIAS.map((c) => (
          <FilterChip key={c} active={cat === c} count={counts[c] || 0} onClick={() => setCat(c)}>{c}</FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState icon="▦" title="Nenhum produto" sub="Ajuste o filtro ou cadastre um novo produto." /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {filtered.map((p) => <ProdutoCard key={p.id} p={p} onEdit={(prod) => openModal("produto", prod)} />)}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Produtos });

// ============================================================
// Component sheet — design system reference
// ============================================================

function Swatch({ name, value, hex }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ height: 64, borderRadius: 8, background: value, border: "1px solid var(--line)" }} />
      <div>
        <div className="cond" style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>{name}</div>
        <div className="num muted" style={{ fontSize: 11.5, letterSpacing: ".05em" }}>{hex}</div>
      </div>
    </div>
  );
}

function SheetBlock({ title, children, desc }) {
  return (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid var(--line-soft)" }}>
        <h2 style={{ fontSize: 20, fontStyle: "italic", textTransform: "uppercase", letterSpacing: ".02em" }}>{title}</h2>
        {desc && <span className="muted" style={{ fontSize: 12.5 }}>{desc}</span>}
      </div>
      {children}
    </div>
  );
}

function Componentes() {
  const [inp, setInp] = useState({ def: "Banner Lona 440g", focus: "", err: "" });
  return (
    <div className="screen-enter">
      <PageHead eyebrow="Referência · design system" title="Componentes" />

      <div className="card" style={{ padding: "28px 30px" }}>
        {/* Colors */}
        <SheetBlock title="Paleta" desc="Alto contraste · amarelo como acento puro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))", gap: 16 }}>
            <Swatch name="Yellow" value="#F5C800" hex="#F5C800" />
            <Swatch name="Background" value="#0C0C0C" hex="#0C0C0C" />
            <Swatch name="Surface" value="#141414" hex="#141414" />
            <Swatch name="Sidebar" value="#080808" hex="#080808" />
            <Swatch name="Input" value="#1C1C1C" hex="#1C1C1C" />
            <Swatch name="Text" value="#F0EFE8" hex="#F0EFE8" />
            <Swatch name="Muted" value="#888880" hex="#888880" />
            <Swatch name="Success" value="#7EC850" hex="#7EC850" />
            <Swatch name="Danger" value="#FF4040" hex="#FF4040" />
          </div>
        </SheetBlock>

        {/* Type */}
        <SheetBlock title="Tipografia" desc="Barlow Condensed (títulos) · Barlow (corpo)">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="cond" style={{ fontSize: 44, fontWeight: 800, fontStyle: "italic", lineHeight: 1 }}>Comunicação que vira o jogo!</div>
            <div className="eyebrow" style={{ fontSize: 12 }}>Eyebrow · uppercase condensed · .14em tracking</div>
            <div style={{ fontSize: 14, maxWidth: 560, color: "var(--muted)" }}>Corpo de texto em Barlow regular. Usado em tabelas, formulários e descrições. Mantém legibilidade em superfícies escuras com bom contraste.</div>
          </div>
        </SheetBlock>

        {/* Buttons */}
        <SheetBlock title="Botões">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
            <Btn variant="primary">Primário</Btn>
            <Btn variant="primary" icon="＋">Com ícone</Btn>
            <Btn variant="ghost">Ghost</Btn>
            <Btn variant="success">Aprovar</Btn>
            <Btn variant="danger-ghost">Recusar</Btn>
            <Btn variant="primary" disabled>Desabilitado</Btn>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Btn variant="primary" size="sm">Pequeno</Btn>
            <Btn variant="ghost" size="sm">Pequeno</Btn>
            <Btn variant="success" size="sm">Aprovar</Btn>
          </div>
        </SheetBlock>

        {/* Badges */}
        <SheetBlock title="Badges" desc="Retângulo arredondado · nunca pílula">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Badge tone="yellow" dot>Novo</Badge>
            <Badge tone="yellow-dim" dot>Aguardando Orç.</Badge>
            <Badge tone="green" dot>Aprovado</Badge>
            <Badge tone="blue" dot>Em Produção</Badge>
            <Badge tone="green" dot>Concluído</Badge>
            <Badge tone="red" dot>Recusado</Badge>
            <Badge tone="yellow">PJ</Badge>
            <Badge tone="gray">PF</Badge>
          </div>
        </SheetBlock>

        {/* Inputs */}
        <SheetBlock title="Campos de entrada" desc="Default · foco (glow amarelo) · erro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, maxWidth: 720 }}>
            <div>
              <label className="field-label">Default</label>
              <input className="input" value={inp.def} onChange={(e) => setInp({ ...inp, def: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Foco</label>
              <input className="input" placeholder="Clique para focar" style={{ borderColor: "var(--yellow)", boxShadow: "0 0 0 3px rgba(245,200,0,.16)" }} defaultValue="Em foco" />
            </div>
            <div>
              <label className="field-label">Erro</label>
              <input className="input is-error" defaultValue="" placeholder="Campo obrigatório" />
              <div style={{ color: "var(--danger)", fontSize: 11.5, marginTop: 5 }}>Informe um valor válido</div>
            </div>
            <div>
              <label className="field-label">Select / Dropdown</label>
              <select className="input"><option>Categoria…</option><option>Banner</option><option>Adesivo</option></select>
            </div>
          </div>
        </SheetBlock>

        {/* Table states */}
        <SheetBlock title="Estados de linha de tabela" desc="Default · hover · selecionada (acento amarelo)">
          <div style={{ border: "1px solid var(--line-soft)", borderRadius: 8, overflow: "hidden" }}>
            <table className="tbl">
              <thead><tr><th>Estado</th><th>Cliente</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td className="muted cond" style={{ fontSize: 12, textTransform: "uppercase" }}>Default</td><td>Padaria Pão Quente</td><td className="num yellow">R$ 390,00</td><td><Badge tone="yellow" dot>Novo</Badge></td></tr>
                <tr style={{ background: "#161614" }}><td className="muted cond" style={{ fontSize: 12, textTransform: "uppercase" }}>Hover</td><td>Auto Center Veloz</td><td className="num yellow">R$ 2.400,00</td><td><Badge tone="yellow-dim" dot>Aguardando</Badge></td></tr>
                <tr className="is-selected"><td className="muted cond" style={{ fontSize: 12, textTransform: "uppercase" }}>Selecionada</td><td>Academia Corpo & Foco</td><td className="num yellow">R$ 2.000,00</td><td><Badge tone="green" dot>Aprovado</Badge></td></tr>
              </tbody>
            </table>
          </div>
        </SheetBlock>

        {/* Progress + stepper */}
        <SheetBlock title="Progresso & barras">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
            {[25, 60, 100].map((v) => (
              <div key={v} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ProgressBar value={v} />
                <span className="cond" style={{ fontSize: 15, fontWeight: 800, fontStyle: "italic", color: v >= 100 ? "var(--success)" : "var(--yellow)", minWidth: 42, textAlign: "right" }}>{v}%</span>
              </div>
            ))}
          </div>
        </SheetBlock>
      </div>
    </div>
  );
}

Object.assign(window, { Componentes });

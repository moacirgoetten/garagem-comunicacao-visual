// ============================================================
// Screen 3 — Clientes
// ============================================================

function Clientes({ openModal }) {
  const app = useApp();
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const handleDelete = async (e, c) => {
    e.stopPropagation();
    if (!window.confirm(`Excluir cliente "${c.nome}"? Esta ação não pode ser desfeita.`)) return;
    await app.deleteCliente(c.id);
    setSelected(null);
  };

  const filtered = app.clientes.filter((c) => {
    const okTipo = tipo === "Todos" || c.tipo === tipo;
    const okQ = !q || c.nome.toLowerCase().includes(q.toLowerCase()) || c.documento.includes(q);
    return okTipo && okQ;
  });

  return (
    <div className="screen-enter">
      <PageHead eyebrow="Cadastro de clientes" title="Clientes">
        <Search value={q} onChange={setQ} placeholder="Nome ou documento..." />
        <Btn variant="primary" icon="＋" onClick={() => openModal("cliente")}>Novo Cliente</Btn>
      </PageHead>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["Todos", "PJ", "PF"].map((t) => (
          <FilterChip key={t} active={tipo === t} count={t === "Todos" ? app.clientes.length : app.clientes.filter((c) => c.tipo === t).length} onClick={() => setTipo(t)}>{t === "Todos" ? "Todos" : t === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}</FilterChip>
        ))}
      </div>

      <Panel pad={false}>
        <table className="tbl">
          <thead>
            <tr><th>Nome / Razão Social</th><th>Tipo</th><th>Documento</th><th>Telefone</th><th style={{ textAlign: "center" }}>Pedidos</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className={selected === c.id ? "is-selected" : ""} onClick={() => setSelected(selected === c.id ? null : c.id)} style={{ cursor: "pointer" }}>
                <td><ClientCell cliente={c} /></td>
                <td><Badge tone={c.tipo === "PJ" ? "yellow" : "gray"}>{c.tipo}</Badge></td>
                <td className="num muted" style={{ fontSize: 13, letterSpacing: ".02em" }}>{c.documento}</td>
                <td className="num" style={{ fontSize: 13 }}>{c.telefone}</td>
                <td style={{ textAlign: "center" }}><span className="cond" style={{ fontSize: 16, fontWeight: 700, fontStyle: "italic" }}>{app.numPedidosCliente(c.id)}</span></td>
                <td><Badge tone={c.status === "Ativo" ? "green" : "gray"} dot>{c.status}</Badge></td>
                <td style={{ textAlign: "right" }}>
                  {app.numPedidosCliente(c.id) === 0 && (
                    <Btn size="sm" variant="danger-ghost" onClick={(e) => handleDelete(e, c)} title="Excluir cliente">✕</Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon="◑" title="Nenhum cliente" sub="Ajuste a busca ou cadastre um novo cliente." />}
      </Panel>
    </div>
  );
}

Object.assign(window, { Clientes });

// ============================================================
// App root — router + provider + modal host
// ============================================================

const TITLES = {
  dashboard: "Dashboard", produtos: "Produtos", clientes: "Clientes",
  pedidos: "Pedidos", orcamentos: "Orçamentos", ordens: "Ordens de Serviço",
  componentes: "Componentes",
};

function AppShell({ store }) {
  const [route, setRoute] = useState("dashboard");
  const [params, setParams] = useState(null);
  const [modal, setModal] = useState(null); // {type, data}
  const scrollRef = useRef(null);

  const navigate = useCallback((to, p = null) => {
    setParams(p);
    setRoute(to);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (p && p.newOrder) setTimeout(() => setModal({ type: "pedido" }), 60);
  }, []);

  const openModal = useCallback((type, data = null) => setModal({ type, data }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const screen = () => {
    switch (route) {
      case "dashboard":   return <Dashboard onNavigate={navigate} />;
      case "produtos":    return <Produtos openModal={openModal} />;
      case "clientes":    return <Clientes openModal={openModal} />;
      case "pedidos":     return <Pedidos openModal={openModal} onNavigate={navigate} />;
      case "orcamentos":  return <Orcamentos onNavigate={navigate} params={params} />;
      case "ordens":      return <Ordens />;
      case "componentes": return <Componentes />;
      default:            return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <AppCtx.Provider value={store}>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar route={route} onNavigate={navigate} />

        <main className="dotgrid" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* top bar */}
          <header style={{ height: 56, borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "center", padding: "0 28px", gap: 14, flexShrink: 0, background: "rgba(12,12,12,.6)", backdropFilter: "blur(6px)" }}>
            <div className="eyebrow" style={{ fontSize: 10, color: "var(--muted-2)" }}>Garagem CV</div>
            <span style={{ color: "var(--muted-2)" }}>/</span>
            <div className="cond" style={{ fontSize: 15, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text)" }}>{TITLES[route]}</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
              <span className="cond italic" style={{ fontSize: 14, color: "var(--yellow)", fontWeight: 600, letterSpacing: ".01em" }}>Comunicação que vira o jogo!</span>
              <div style={{ width: 1, height: 22, background: "var(--line)" }} />
              <button style={{ position: "relative", width: 34, height: 34, borderRadius: 6, border: "1px solid var(--line)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 15 }}>
                ◔
                <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "var(--yellow)", border: "1.5px solid var(--bg)" }} />
              </button>
            </div>
          </header>

          {/* scroll area */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "26px 28px 40px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>{screen()}</div>
          </div>
        </main>
      </div>

      {/* modals */}
      {modal && modal.type === "produto" && <ProdutoForm initial={modal.data} onClose={closeModal} />}
      {modal && modal.type === "cliente" && <ClienteForm onClose={closeModal} />}
      {modal && modal.type === "pedido" && <PedidoForm onClose={closeModal} />}

      <Toast toast={store.toast} onClose={() => store.setToast(null)} />
    </AppCtx.Provider>
  );
}

function App() {
  const store = useStore();

  if (store.carregando) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="cond italic yellow" style={{ fontSize: 32, fontWeight: 800, letterSpacing: ".02em" }}>
            Garagem CV
          </div>
          <div className="eyebrow" style={{ marginTop: 12, color: "var(--muted)" }}>
            Conectando ao servidor...
          </div>
        </div>
      </div>
    );
  }

  return <AppShell store={store} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

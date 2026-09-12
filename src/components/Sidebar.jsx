function Sidebar({ paginaAtiva, onNavigate, onLogout, admin = false }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-icon">🏪</div>
        <span>Gestão Comercial</span>
      </div>

      <nav className="sidebar-menu">
        <button
          className={`menu-item ${paginaAtiva === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <span>📊</span>
          Dashboard
        </button>

        {admin && (
          <button
            className={`menu-item ${paginaAtiva === "filiais" ? "active" : ""}`}
            onClick={() => onNavigate("filiais")}
          >
            <span>🏢</span>
            Filiais
          </button>
        )}

        <button
          className={`menu-item ${paginaAtiva === "vendas" ? "active" : ""}`}
          onClick={() => onNavigate("vendas")}
        >
          <span>🛒</span>
          Vendas
        </button>

        <button
          className={`menu-item ${paginaAtiva === "estoque" ? "active" : ""}`}
          onClick={() => onNavigate("estoque")}
        >
          <span>📦</span>
          Estoque
        </button>

        {admin && (
          <button
            className={`menu-item ${
              paginaAtiva === "comparativo" ? "active" : ""
            }`}
            onClick={() => onNavigate("comparativo")}
          >
            <span>📈</span>
            Comparativo
          </button>
        )}

        <button
          className={`menu-item ${
            paginaAtiva === "relatorios" ? "active" : ""
          }`}
          onClick={() => onNavigate("relatorios")}
        >
          <span>📄</span>
          Relatórios
        </button>

        {admin && (
          <button
            className={`menu-item ${
              paginaAtiva === "configuracoes" ? "active" : ""
            }`}
            onClick={() => onNavigate("configuracoes")}
          >
            <span>⚙️</span>
            Configurações
          </button>
        )}
      </nav>

      <div className="sidebar-bottom">
        <button className="menu-item">
          <span>❓</span>
          Ajuda
        </button>

        <button className="menu-item" onClick={onLogout}>
          <span>↪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

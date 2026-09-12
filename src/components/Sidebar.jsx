import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Package,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Store,
} from "lucide-react";

function Sidebar({ onLogout, admin = false }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-icon">
          <Store size={20} />
        </div>

        <span>Gestão Comercial</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="menu-item">
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        {admin && (
          <NavLink to="/filiais" className="menu-item">
            <Building2 size={19} />
            Filiais
          </NavLink>
        )}

        <NavLink to="/vendas" className="menu-item">
          <ShoppingCart size={19} />
          Vendas
        </NavLink>

        <NavLink to="/estoque" className="menu-item">
          <Package size={19} />
          Estoque
        </NavLink>

        {admin && (
          <NavLink to="/comparativo" className="menu-item">
            <BarChart3 size={19} />
            Comparativo
          </NavLink>
        )}

        <NavLink to="/relatorios" className="menu-item">
          <FileText size={19} />
          Relatórios
        </NavLink>

        {admin && (
          <NavLink to="/configuracoes" className="menu-item">
            <Settings size={19} />
            Configurações
          </NavLink>
        )}
      </nav>

      <div className="sidebar-bottom">
        <button className="menu-item">
          <HelpCircle size={19} />
          Ajuda
        </button>

        <button className="menu-item" onClick={handleLogout}>
          <LogOut size={19} />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

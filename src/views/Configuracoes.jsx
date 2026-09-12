import "./Dashboard.css";

import { useState } from "react";
import { getFiliais } from "../services/pdvService";

import FiliaisConfig from "../components/FiliaisConfig";
import UsuariosConfig from "../components/UsuariosConfig";

function Configuracoes({ usuario, onNavigate, usuarios, setUsuarios }) {
  const [filiais, setFiliais] = useState(getFiliais());
  const [abaAtiva, setAbaAtiva] = useState("filiais");

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-icon">🏪</div>
          <span>Gestão Comercial</span>
        </div>

        <nav className="sidebar-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}>
            <span>📊</span>
            Dashboard
          </button>

          <button className="menu-item">
            <span>🏢</span>
            Filiais
          </button>

          <button className="menu-item">
            <span>🛒</span>
            Vendas
          </button>

          <button className="menu-item">
            <span>📦</span>
            Estoque
          </button>

          <button className="menu-item">
            <span>📈</span>
            Comparativo
          </button>

          <button className="menu-item">
            <span>📄</span>
            Relatórios
          </button>

          <button className="menu-item active">
            <span>⚙️</span>
            Configurações
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="menu-item">
            <span>❓</span>
            Ajuda
          </button>

          <button className="menu-item">
            <span>↪</span>
            Sair
          </button>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Configurações</h1>

            <p>Gerencie as informações administrativas</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${abaAtiva === "empresa" ? "active" : ""}`}
            onClick={() => setAbaAtiva("empresa")}
          >
            Empresa
          </button>

          <button
            className={`settings-tab ${abaAtiva === "filiais" ? "active" : ""}`}
            onClick={() => setAbaAtiva("filiais")}
          >
            Filiais
          </button>

          <button
            className={`settings-tab ${
              abaAtiva === "usuarios" ? "active" : ""
            }`}
            onClick={() => setAbaAtiva("usuarios")}
          >
            Usuários
          </button>
        </div>

        {abaAtiva === "filiais" && (
          <FiliaisConfig filiais={filiais} setFiliais={setFiliais} />
        )}

        {abaAtiva === "usuarios" && (
          <UsuariosConfig
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            filiais={filiais}
          />
        )}
      </section>
    </main>
  );
}

export default Configuracoes;

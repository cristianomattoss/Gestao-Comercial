import "./Dashboard.css";

import { useState } from "react";
import { getFiliais } from "../services/pdvService";
import { criarFilial } from "../controllers/filialController";

function Configuracoes({ usuario, onNavigate }) {
  const [filiais, setFiliais] = useState(getFiliais());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeFilial, setNomeFilial] = useState("");
  const [cidade, setCidade] = useState("");
  const [gestor, setGestor] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("filiais");

  function cadastrarFilial() {
    const filiaisAtualizadas = criarFilial(filiais, nomeFilial, cidade, gestor);

    setFiliais(filiaisAtualizadas);

    setNomeFilial("");
    setCidade("");
    setGestor("");

    setMostrarFormulario(false);
  }

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
          <>
            {mostrarFormulario && (
              <div className="dashboard-card">
                <h3>Nova filial</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nomeFilial">Nome da filial</label>
                    <input
                      id="nomeFilial"
                      name="nomeFilial"
                      type="text"
                      value={nomeFilial}
                      onChange={(e) => setNomeFilial(e.target.value)}
                      placeholder="Ex.: Filial Centro"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                      id="cidade"
                      name="cidade"
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Ex.: Rio de Janeiro"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gestor">Gestor</label>
                    <input
                      id="gestor"
                      name="gestor"
                      type="text"
                      value={gestor}
                      onChange={(e) => setGestor(e.target.value)}
                      placeholder="Nome do gestor"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </button>

                  <button className="primary-button" onClick={cadastrarFilial}>
                    Cadastrar filial
                  </button>
                </div>
              </div>
            )}

            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3>Filiais cadastradas</h3>
                  <p>Gerencie as filiais da empresa.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setMostrarFormulario(true)}
                >
                  + Nova filial
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Filial</th>
                    <th>Cidade</th>
                    <th>Gestor</th>
                  </tr>
                </thead>

                <tbody>
                  {filiais.map((filial) => (
                    <tr key={filial.id}>
                      <td>{filial.nome}</td>
                      <td>{filial.cidade}</td>
                      <td>{filial.gerente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Configuracoes;

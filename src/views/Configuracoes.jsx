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
          <button className="settings-tab">Empresa</button>

          <button className="settings-tab active">Filiais</button>

          <button className="settings-tab">Usuários</button>
        </div>

        {mostrarFormulario && (
          <div className="dashboard-card">
            <div className="card-header settings-header">
              <div>
                <h2>Nova filial</h2>

                <p>Cadastre uma nova filial da empresa</p>
              </div>

              <button
                className="secondary-button"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>

            <div className="settings-form">
              <div className="input-group">
                <label htmlFor="nomeFilial">Nome da filial</label>

                <input
                  id="nomeFilial"
                  name="nomeFilial"
                  type="text"
                  placeholder="Ex.: Filial Centro"
                  value={nomeFilial}
                  onChange={(event) => setNomeFilial(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="cidade">Cidade</label>

                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  placeholder="Ex.: Rio de Janeiro"
                  value={cidade}
                  onChange={(event) => setCidade(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="gestor">Gestor responsável</label>

                <input
                  id="gestor"
                  name="gestor"
                  type="text"
                  placeholder="Ex.: Carlos Silva"
                  value={gestor}
                  onChange={(event) => setGestor(event.target.value)}
                />
              </div>

              <button className="primary-button" onClick={cadastrarFilial}>
                Cadastrar filial
              </button>
            </div>
          </div>
        )}

        <div className="dashboard-card">
          <div className="card-header settings-header">
            <div>
              <h2>Filiais</h2>

              <p>Gerencie as filiais cadastradas</p>
            </div>

            <button
              className="primary-button"
              onClick={() => setMostrarFormulario(true)}
            >
              + Nova filial
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Filial</th>
                <th>Cidade</th>
                <th>Gestor responsável</th>
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
      </section>
    </main>
  );
}

export default Configuracoes;

import "./Dashboard.css";

import {
  getFiliais,
} from "../services/pdvService";

function Configuracoes({ usuario, onNavigate }) {
  const filiais = getFiliais();

  return (
    <main className="dashboard-page">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="sidebar-icon">🏪</div>
          <span>Gestão Comercial</span>
        </div>

        <nav className="sidebar-menu">

          <button
            className="menu-item"
            onClick={() => onNavigate("dashboard")}
          >
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

            <p>
              Gerencie as informações administrativas
            </p>
          </div>

          <div className="user-info">

            <div className="user-avatar">
              A
            </div>

            <div>
              <strong>Administrador</strong>
              <span>{usuario?.email}</span>
            </div>

          </div>

        </header>

        <div className="settings-tabs">

          <button className="settings-tab">
            Empresa
          </button>

          <button className="settings-tab active">
            Filiais
          </button>

          <button className="settings-tab">
            Usuários
          </button>

        </div>

        <div className="dashboard-card">

          <div className="card-header settings-header">

            <div>
              <h2>Filiais</h2>

              <p>
                Gerencie as filiais cadastradas
              </p>
            </div>

            <button className="primary-button">
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

                  <td>
                    {filial.nome}
                  </td>

                  <td>
                    {filial.cidade}
                  </td>

                  <td>
                    {filial.gerente}
                  </td>

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
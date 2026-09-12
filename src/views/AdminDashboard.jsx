import "./Dashboard.css";
import Sidebar from "../components/Sidebar";

function AdminDashboard({ usuario, onNavigate, onLogout }) {
  return (
    <main className="dashboard-page">
      <Sidebar
        paginaAtiva="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        admin
      />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral do desempenho da empresa</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-filters">
          <div className="filter-group">
            <label>Período</label>

            <select>
              <option>Setembro de 2026</option>
            </select>
          </div>
        </div>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Faturamento</span>

            <strong>R$ 186.450,00</strong>

            <small>Todas as filiais</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>

            <strong>1.284</strong>

            <small>vendas realizadas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Filiais</span>

            <strong>4</strong>

            <small>filiais cadastradas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Produtos vendidos</span>

            <strong>4.832</strong>

            <small>unidades</small>
          </div>
        </section>

        <section className="dashboard-tables">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Desempenho das filiais</h2>

                <p>Faturamento no mês selecionado</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Filial</th>
                  <th>Vendas</th>
                  <th>Faturamento</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Filial Centro</td>
                  <td>342</td>
                  <td>R$ 48.750,00</td>
                </tr>

                <tr>
                  <td>Filial Norte</td>
                  <td>318</td>
                  <td>R$ 46.280,00</td>
                </tr>

                <tr>
                  <td>Filial Sul</td>
                  <td>326</td>
                  <td>R$ 45.620,00</td>
                </tr>

                <tr>
                  <td>Filial Oeste</td>
                  <td>298</td>
                  <td>R$ 45.800,00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Estoque baixo</h2>

                <p>Produtos que precisam de atenção</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Filial</th>
                  <th>Estoque</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Café Tradicional 500g</td>
                  <td>Centro</td>
                  <td className="stock-low">8</td>
                </tr>

                <tr>
                  <td>Leite Integral 1L</td>
                  <td>Norte</td>
                  <td className="stock-low">5</td>
                </tr>

                <tr>
                  <td>Açúcar 1kg</td>
                  <td>Sul</td>
                  <td className="stock-low">7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;

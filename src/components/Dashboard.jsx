import "./Dashboard.css";

function Dashboard({ usuario }) {
  return (
    <main className="dashboard-page">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="sidebar-icon">🏪</div>
          <span>Gestão Comercial</span>
        </div>

        <nav className="sidebar-menu">

          <button className="menu-item active">
            <span>📊</span>
            Dashboard
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
            <span>📄</span>
            Relatórios
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
            <h1>Dashboard</h1>
            <p>Visão geral do desempenho da sua filial</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {usuario?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>Gestor</strong>
              <span>{usuario?.email}</span>
            </div>
          </div>

        </header>

        <div className="dashboard-filters">

          <div className="filter-group">
            <label>Filial</label>

            <select>
              <option>Filial Centro</option>
            </select>
          </div>

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
            <strong>R$ 48.750,00</strong>
            <small>Setembro de 2026</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>
            <strong>342</strong>
            <small>vendas realizadas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Ticket médio</span>
            <strong>R$ 142,54</strong>
            <small>por venda</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Produtos vendidos</span>
            <strong>1.284</strong>
            <small>unidades</small>
          </div>

        </section>

        <section className="dashboard-tables">

          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h2>Produtos mais vendidos</h2>
                <p>Produtos com maior quantidade de vendas</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Quantidade</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Café Tradicional 500g</td>
                  <td>Alimentos</td>
                  <td>186</td>
                </tr>

                <tr>
                  <td>Arroz 5kg</td>
                  <td>Alimentos</td>
                  <td>142</td>
                </tr>

                <tr>
                  <td>Refrigerante 2L</td>
                  <td>Bebidas</td>
                  <td>128</td>
                </tr>

                <tr>
                  <td>Leite Integral 1L</td>
                  <td>Laticínios</td>
                  <td>115</td>
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
                  <th>Estoque</th>
                  <th>Mínimo</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Café Tradicional 500g</td>
                  <td className="stock-low">8</td>
                  <td>10</td>
                </tr>

                <tr>
                  <td>Leite Integral 1L</td>
                  <td className="stock-low">5</td>
                  <td>10</td>
                </tr>

                <tr>
                  <td>Açúcar 1kg</td>
                  <td className="stock-low">7</td>
                  <td>8</td>
                </tr>

              </tbody>
            </table>

          </div>

        </section>

      </section>

    </main>
  );
}

export default Dashboard;
import "./Dashboard.css";
import {
  getFiliais,
  getVendasPorFilialEMes,
  getProdutosMaisVendidos,
  getEstoqueBaixo,
} from "../services/pdvService";

function Dashboard({ usuario, onNavigate }) {
  const filial = getFiliais().find(
    (filial) => filial.nome === usuario?.filial
  );

  const vendas = getVendasPorFilialEMes(
    filial?.id,
    "2026-09"
  );

  const faturamento = vendas.reduce(
    (total, venda) => total + venda.valorTotal,
    0
  );

  const quantidadeVendas = vendas.length;

  const produtosVendidos = vendas.reduce(
    (total, venda) => total + venda.quantidade,
    0
  );

  const ticketMedio =
    quantidadeVendas > 0
      ? faturamento / quantidadeVendas
      : 0;

  const produtosMaisVendidos = getProdutosMaisVendidos(
    filial?.id,
    "2026-09"
  );

  const estoqueBaixo = getEstoqueBaixo(
    filial?.id
  );

  return (
    <main className="dashboard-page">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="sidebar-icon">🏪</div>
          <span>Gestão Comercial</span>
        </div>

        <nav className="sidebar-menu">

          <button
            className="menu-item active"
            onClick={() => onNavigate("dashboard")}
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className="menu-item"
            onClick={() => onNavigate("vendas")}
          >
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
            <strong>
              R$ {faturamento.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>Setembro de 2026</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>
            <strong>{quantidadeVendas}</strong>
            <small>vendas realizadas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Ticket médio</span>
            <strong>
              R$ {ticketMedio.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>por venda</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Produtos vendidos</span>
            <strong>{produtosVendidos}</strong>
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
                {produtosMaisVendidos.map((produto) => (
                  <tr key={produto.nome}>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.quantidade}</td>
                  </tr>
                ))}
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
                {estoqueBaixo.map((produto) => (
                  <tr key={produto.nome}>
                    <td>{produto.nome}</td>

                    <td className="stock-low">
                      {produto.quantidade}
                    </td>

                    <td>
                      {produto.estoqueMinimo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        </section>

      </section>

    </main>
  );
}

export default Dashboard;
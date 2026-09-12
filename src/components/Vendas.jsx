import "./Dashboard.css";
import {
  getFiliais,
  getProdutos,
  getCategorias,
  getVendasPorFilialEMes,
} from "../services/pdvService";

function Vendas({ usuario, onNavigate }) {
  const filiais = getFiliais();
  const produtos = getProdutos();
  const categorias = getCategorias();

  const filial = filiais.find(
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

          <button className="menu-item active">
            <span>🛒</span>
            Vendas
          </button>

          <button
            className="menu-item"
            onClick={() => onNavigate("estoque")}
          >
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
            <h1>Vendas</h1>
            <p>
              Consulte as vendas registradas no PDV
            </p>
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

            <select value={filial?.nome || ""} disabled>
              <option>
                {filial?.nome}
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>Período</label>

            <select defaultValue="2026-09">
              <option value="2026-09">
                Setembro de 2026
              </option>
            </select>
          </div>

        </div>

        <section className="kpi-grid">

          <div className="kpi-card">
            <span className="kpi-title">
              Total de vendas
            </span>

            <strong>
              {vendas.length}
            </strong>

            <small>
              vendas no período
            </small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">
              Faturamento
            </span>

            <strong>
              R$ {faturamento.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </strong>

            <small>
              no período
            </small>
          </div>

        </section>

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Vendas do período</h2>

              <p>
                Dados provenientes do banco de dados do PDV
              </p>
            </div>

          </div>

          <table>

            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Valor total</th>
              </tr>
            </thead>

            <tbody>

              {vendas.map((venda) => {

                const produto = produtos.find(
                  (produto) =>
                    produto.id === venda.produtoId
                );

                const categoria = categorias.find(
                  (categoria) =>
                    categoria.id === produto?.categoriaId
                );

                return (
                  <tr key={venda.id}>

                    <td>
                      {produto?.nome}
                    </td>

                    <td>
                      {categoria?.nome}
                    </td>

                    <td>
                      {venda.quantidade}
                    </td>

                    <td>
                      R$ {venda.valorTotal.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

export default Vendas;
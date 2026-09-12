import "./Dashboard.css";

import {
  getFiliais,
  getEstoque,
  getProdutos,
  getCategorias,
} from "../services/pdvService";

function Estoque({ usuario, onNavigate }) {
  const filiais = getFiliais();
  const estoque = getEstoque();
  const produtos = getProdutos();
  const categorias = getCategorias();

  const filial = filiais.find(
    (filial) => filial.nome === usuario?.filial
  );

  const estoqueFilial = estoque.filter(
    (item) => item.filialId === filial?.id
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

          <button
            className="menu-item"
            onClick={() => onNavigate("vendas")}
          >
            <span>🛒</span>
            Vendas
          </button>

          <button className="menu-item active">
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
            <h1>Estoque</h1>

            <p>
              Consulte o estoque dos produtos da sua filial
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

        </div>

        <section className="kpi-grid">

          <div className="kpi-card">

            <span className="kpi-title">
              Produtos
            </span>

            <strong>
              {estoqueFilial.length}
            </strong>

            <small>
              produtos em estoque
            </small>

          </div>

          <div className="kpi-card">

            <span className="kpi-title">
              Estoque baixo
            </span>

            <strong>
              {
                estoqueFilial.filter(
                  (item) =>
                    item.quantidade <= item.estoqueMinimo
                ).length
              }
            </strong>

            <small>
              produtos precisam de atenção
            </small>

          </div>

        </section>

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>Estoque da filial</h2>

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
                <th>Estoque atual</th>
                <th>Estoque mínimo</th>
                <th>Situação</th>
              </tr>

            </thead>

            <tbody>

              {estoqueFilial.map((item) => {

                const produto = produtos.find(
                  (produto) =>
                    produto.id === item.produtoId
                );

                const categoria = categorias.find(
                  (categoria) =>
                    categoria.id === produto?.categoriaId
                );

                const estoqueBaixo =
                  item.quantidade <= item.estoqueMinimo;

                return (
                  <tr key={`${item.filialId}-${item.produtoId}`}>

                    <td>
                      {produto?.nome}
                    </td>

                    <td>
                      {categoria?.nome}
                    </td>

                    <td
                      className={
                        estoqueBaixo
                          ? "stock-low"
                          : ""
                      }
                    >
                      {item.quantidade}
                    </td>

                    <td>
                      {item.estoqueMinimo}
                    </td>

                    <td
                      className={
                        estoqueBaixo
                          ? "stock-low"
                          : ""
                      }
                    >
                      {estoqueBaixo
                        ? "Estoque baixo"
                        : "Normal"}
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

export default Estoque;
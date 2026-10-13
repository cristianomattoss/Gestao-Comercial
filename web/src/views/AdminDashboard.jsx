import "./Dashboard.css";
import Sidebar from "../components/Sidebar";

import {
  getFiliais,
  getVendas,
  getEstoque,
  getProdutos,
} from "../services/pdvService";

import { meses } from "../data/pdvData";

function AdminDashboard({ usuario, onNavigate, onLogout }) {
  const filiais = getFiliais();
  const vendas = getVendas();
  const estoque = getEstoque();
  const produtos = getProdutos();

  const mesSelecionado = "2026-09";

  const vendasDoMes = vendas.filter((venda) => venda.mes === mesSelecionado);

  const faturamento = vendasDoMes.reduce(
    (total, venda) => total + venda.valorTotal,
    0,
  );

  const unidadesVendidas = vendasDoMes.reduce(
    (total, venda) => total + venda.quantidade,
    0,
  );

  const estoqueBaixo = estoque.filter(
    (item) => item.quantidade <= item.estoqueMinimo,
  );

  const desempenhoFiliais = filiais.map((filial) => {
    const vendasFilial = vendasDoMes.filter(
      (venda) => venda.filialId === filial.id,
    );

    const faturamentoFilial = vendasFilial.reduce(
      (total, venda) => total + venda.valorTotal,
      0,
    );

    return {
      ...filial,
      vendas: vendasFilial.length,
      faturamento: faturamentoFilial,
    };
  });

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
            <div className="user-avatar">
              {usuario?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>Administrador</strong>
              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-filters">
          <div className="filter-group">
            <label>Período</label>

            <select
              value={mesSelecionado}
              onChange={(event) => setMesSelecionado(event.target.value)}
            >
              {meses.map((mes) => (
                <option key={mes.valor} value={mes.valor}>
                  {mes.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Faturamento</span>

            <strong>
              R${" "}
              {faturamento.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </strong>

            <small>Todas as filiais</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>

            <strong>{vendasDoMes.length}</strong>

            <small>vendas realizadas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Filiais</span>

            <strong>{filiais.length}</strong>

            <small>filiais cadastradas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Produtos vendidos</span>

            <strong>{unidadesVendidas}</strong>

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
                {desempenhoFiliais.map((filial) => (
                  <tr key={filial.id}>
                    <td>{filial.nome}</td>

                    <td>{filial.vendas}</td>

                    <td>
                      R${" "}
                      {filial.faturamento.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
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
                  <th>Filial</th>
                  <th>Estoque</th>
                </tr>
              </thead>

              <tbody>
                {estoqueBaixo.map((item) => {
                  const produto = produtos.find(
                    (produto) => produto.id === item.produtoId,
                  );

                  const filial = filiais.find(
                    (filial) => filial.id === item.filialId,
                  );

                  return (
                    <tr key={`${item.filialId}-${item.produtoId}`}>
                      <td>{produto?.nome}</td>

                      <td>{filial?.nome}</td>

                      <td className="stock-low">{item.quantidade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;

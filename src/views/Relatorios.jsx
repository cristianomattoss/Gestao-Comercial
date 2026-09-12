import "./Dashboard.css";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import { getFiliais, getVendas, getEstoque } from "../services/pdvService";
import { ESTADOS } from "../models/AppState";

function Relatorios({ usuario, onLogout }) {
  const filiais = getFiliais();
  const vendas = getVendas();
  const estoque = getEstoque();

  const [mesSelecionado, setMesSelecionado] = useState("2026-09");

  const vendasFiltradas = vendas.filter(
    (venda) => venda.mes === mesSelecionado,
  );

  const faturamento = vendasFiltradas.reduce(
    (total, venda) => total + venda.valorTotal,
    0,
  );

  const produtosEstoqueBaixo = estoque.filter(
    (item) => item.quantidade <= item.estoqueMinimo,
  ).length;

  const dadosFiliais = filiais.map((filial) => {
    const vendasFilial = vendasFiltradas.filter(
      (venda) => venda.filialId === filial.id,
    );

    const faturamentoFilial = vendasFilial.reduce(
      (total, venda) => total + venda.valorTotal,
      0,
    );

    return {
      ...filial,
      quantidadeVendas: vendasFilial.length,
      faturamento: faturamentoFilial,
    };
  });

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin={usuario?.perfil === ESTADOS.ADMIN} />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Relatórios</h1>

            <p>Consulte os principais indicadores gerenciais</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {usuario?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>
                {usuario?.perfil === ESTADOS.ADMIN ? "Administrador" : "Gestor"}
              </strong>

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
              <option value="2026-09">Setembro de 2026</option>
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

            <small>no período</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>

            <strong>{vendasFiltradas.length}</strong>

            <small>vendas no período</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Estoque baixo</span>

            <strong>{produtosEstoqueBaixo}</strong>

            <small>produtos precisam de atenção</small>
          </div>
        </section>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Resumo por filial</h2>

              <p>Indicadores consolidados do período</p>
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
              {dadosFiliais.map((filial) => (
                <tr key={filial.id}>
                  <td>{filial.nome}</td>

                  <td>{filial.quantidadeVendas}</td>

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
      </section>
    </main>
  );
}

export default Relatorios;

import "./Dashboard.css";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import { getFiliais, getVendas } from "../services/pdvService";

function Comparativo({ usuario, onLogout }) {
  const filiais = getFiliais();
  const vendas = getVendas();

  const [mesSelecionado, setMesSelecionado] = useState("2026-09");

  const dadosFiliais = filiais.map((filial) => {
    const vendasFilial = vendas.filter(
      (venda) => venda.filialId === filial.id && venda.mes === mesSelecionado,
    );

    const faturamento = vendasFilial.reduce(
      (total, venda) => total + venda.valorTotal,
      0,
    );

    const quantidadeVendas = vendasFilial.length;

    const ticketMedio =
      quantidadeVendas > 0 ? faturamento / quantidadeVendas : 0;

    return {
      ...filial,
      faturamento,
      quantidadeVendas,
      ticketMedio,
    };
  });

  const melhorFilial = [...dadosFiliais].sort(
    (a, b) => b.faturamento - a.faturamento,
  )[0];

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Comparativo</h1>

            <p>Compare o desempenho das filiais</p>
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
              <option value="2026-09">Setembro de 2026</option>
            </select>
          </div>
        </div>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Melhor desempenho</span>

            <strong>{melhorFilial?.nome || "-"}</strong>

            <small>maior faturamento no período</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Maior faturamento</span>

            <strong>
              R${" "}
              {(melhorFilial?.faturamento || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </strong>

            <small>{melhorFilial?.nome || "-"}</small>
          </div>
        </section>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Desempenho por filial</h2>

              <p>Comparação dos indicadores do período</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Filial</th>
                <th>Cidade</th>
                <th>Vendas</th>
                <th>Faturamento</th>
                <th>Ticket médio</th>
              </tr>
            </thead>

            <tbody>
              {dadosFiliais.map((filial) => (
                <tr key={filial.id}>
                  <td>
                    <strong>{filial.nome}</strong>
                  </td>

                  <td>{filial.cidade}</td>

                  <td>{filial.quantidadeVendas}</td>

                  <td>
                    R${" "}
                    {filial.faturamento.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    R${" "}
                    {filial.ticketMedio.toLocaleString("pt-BR", {
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

export default Comparativo;

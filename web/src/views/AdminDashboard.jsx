import "./Dashboard.css";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { carregarDashboardAdmin } from "../controllers/vendaController";
import { meses } from "../data/pdvData";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function AdminDashboard({ usuario, onNavigate, onLogout }) {
  const [mesSelecionado, setMesSelecionado] = useState("2026-09");
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    carregarDashboardAdmin(mesSelecionado)
      .then((resultado) => {
        if (!ativo) return;

        setDados(resultado);
        setErro("");
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      });

    return () => {
      ativo = false;
    };
  }, [mesSelecionado]);

  const indicadores = dados?.indicadores;
  const filiais = dados?.filiais ?? [];

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

        {erro && <p className="login-error">{erro}</p>}

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Faturamento</span>

            <strong>R$ {formatarMoeda(indicadores?.faturamento ?? 0)}</strong>

            <small>Todas as filiais</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>

            <strong>{indicadores?.totalVendas ?? 0}</strong>

            <small>vendas realizadas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Filiais</span>

            <strong>{filiais.length}</strong>

            <small>filiais cadastradas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Produtos vendidos</span>

            <strong>{indicadores?.produtosVendidos ?? 0}</strong>

            <small>unidades</small>
          </div>
        </section>

        <section className="dashboard-tables">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Desempenho das filiais</h2>

                <p>Faturamento e participação no mês selecionado</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Filial</th>
                  <th>Vendas</th>
                  <th>Faturamento</th>
                  <th>Participação</th>
                </tr>
              </thead>

              <tbody>
                {filiais.map((filial) => (
                  <tr key={filial.filialId}>
                    <td>{filial.filial}</td>

                    <td>{filial.totalVendas}</td>

                    <td>R$ {formatarMoeda(filial.faturamento)}</td>

                    <td>
                      {(filial.participacao * 100).toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      %
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
                {(dados?.estoqueBaixo ?? []).map((item) => (
                  <tr key={`${item.filialId}-${item.produtoId}`}>
                    <td>{item.produto}</td>

                    <td>{item.filial}</td>

                    <td className="stock-low">{item.quantidade}</td>
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

export default AdminDashboard;

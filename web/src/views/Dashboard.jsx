import "./Dashboard.css";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { carregarDashboardGestor } from "../controllers/vendaController";
import { meses } from "../data/meses";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function Dashboard({ usuario, onNavigate, onLogout }) {
  const [mesSelecionado, setMesSelecionado] = useState("2026-09");
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    carregarDashboardGestor(mesSelecionado)
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
  const nomeMes = meses.find((mes) => mes.valor === mesSelecionado)?.nome;

  return (
    <main className="dashboard-page">
      <Sidebar
        paginaAtiva="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

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

            <select value={usuario?.filial || ""} disabled>
              <option value={usuario?.filial}>{usuario?.filial}</option>
            </select>
          </div>

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
            <small>{nomeMes}</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Vendas</span>
            <strong>{indicadores?.totalVendas ?? 0}</strong>
            <small>vendas realizadas</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Ticket médio</span>
            <strong>R$ {formatarMoeda(indicadores?.ticketMedio ?? 0)}</strong>
            <small>por venda</small>
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
                {(dados?.maisVendidos ?? []).map((produto) => (
                  <tr key={produto.produtoId}>
                    <td>{produto.produto}</td>
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
                {(dados?.estoqueBaixo ?? []).map((item) => (
                  <tr key={item.produtoId}>
                    <td>{item.produto}</td>

                    <td className="stock-low">{item.quantidade}</td>

                    <td>{item.estoqueMinimo}</td>
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

import "./Dashboard.css";
import { useEffect, useState } from "react";

import { carregarFiliais } from "../controllers/filialController";
import { carregarVendas } from "../controllers/vendaController";

import { ESTADOS } from "../models/AppState";
import Sidebar from "../components/Sidebar";
import { meses } from "../data/pdvData";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function Vendas({ usuario, onLogout }) {
  const ehAdmin = usuario?.perfil === ESTADOS.ADMIN;

  const [filiais, setFiliais] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [indicadores, setIndicadores] = useState(null);
  const [erro, setErro] = useState("");

  const [filialSelecionada, setFilialSelecionada] = useState(
    ehAdmin ? "todas" : usuario?.filial || "",
  );

  const [mesSelecionado, setMesSelecionado] = useState("2026-09");

  useEffect(() => {
    if (!ehAdmin) return;

    carregarFiliais()
      .then(setFiliais)
      .catch((e) => setErro(e.message));
  }, [ehAdmin]);

  useEffect(() => {
    let ativo = true;
    const filialId =
      ehAdmin && filialSelecionada !== "todas" ? filialSelecionada : undefined;

    carregarVendas({ mes: mesSelecionado, filialId })
      .then((dados) => {
        if (!ativo) return;

        setVendas(dados.vendas);
        setIndicadores(dados.indicadores);
        setErro("");
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      });

    return () => {
      ativo = false;
    };
  }, [ehAdmin, filialSelecionada, mesSelecionado]);

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin={ehAdmin} />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Vendas</h1>
            <p>Consulte as vendas registradas no PDV</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {usuario?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{ehAdmin ? "Administrador" : "Gestor"}</strong>

              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-filters">
          <div className="filter-group">
            <label>Filial</label>

            {ehAdmin ? (
              <select
                value={filialSelecionada}
                onChange={(event) => setFilialSelecionada(event.target.value)}
              >
                <option value="todas">Todas as filiais</option>

                {filiais.map((filial) => (
                  <option key={filial.id} value={filial.id}>
                    {filial.nome}
                  </option>
                ))}
              </select>
            ) : (
              <select value={usuario?.filial || ""} disabled>
                <option value={usuario?.filial}>{usuario?.filial}</option>
              </select>
            )}
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
            <span className="kpi-title">Total de vendas</span>

            <strong>{indicadores?.totalVendas ?? 0}</strong>

            <small>vendas no período</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Faturamento</span>

            <strong>R$ {formatarMoeda(indicadores?.faturamento ?? 0)}</strong>

            <small>no período</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Ticket médio</span>

            <strong>R$ {formatarMoeda(indicadores?.ticketMedio ?? 0)}</strong>

            <small>por venda</small>
          </div>
        </section>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Vendas do período</h2>

              <p>Dados provenientes do banco de dados do PDV</p>
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
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.produto}</td>

                  <td>{venda.categoria}</td>

                  <td>{venda.quantidade}</td>

                  <td>R$ {formatarMoeda(venda.valorTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Vendas;

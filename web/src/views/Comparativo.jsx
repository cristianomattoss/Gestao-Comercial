import "./Dashboard.css";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { carregarFiliais } from "../controllers/filialController";
import { compararFiliais } from "../controllers/vendaController";
import { meses } from "../data/meses";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function Comparativo({ usuario, onLogout }) {
  const [filiais, setFiliais] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState("2026-09");
  const [ordenarPor, setOrdenarPor] = useState("faturamento");
  const [dadosFiliais, setDadosFiliais] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarFiliais()
      .then((lista) => {
        setFiliais(lista);
        setSelecionadas(lista.map((filial) => filial.id));
      })
      .catch((e) => setErro(e.message));
  }, []);

  useEffect(() => {
    if (filiais.length === 0) return;

    let ativo = true;

    compararFiliais({ mes: mesSelecionado, filialIds: selecionadas, ordenarPor })
      .then((resultado) => {
        if (!ativo) return;

        setDadosFiliais(resultado.filiais);
        setErro("");
      })
      .catch((e) => {
        if (!ativo) return;

        setDadosFiliais([]);
        setErro(e.message);
      });

    return () => {
      ativo = false;
    };
  }, [filiais, selecionadas, mesSelecionado, ordenarPor]);

  function alternarFilial(id) {
    setSelecionadas((atuais) =>
      atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id],
    );
  }

  const melhorFilial = dadosFiliais[0];
  const cidades = Object.fromEntries(
    filiais.map((filial) => [filial.id, filial.cidade]),
  );

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
              {meses.map((mes) => (
                <option key={mes.valor} value={mes.valor}>
                  {mes.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Ordenar por</label>

            <select
              value={ordenarPor}
              onChange={(event) => setOrdenarPor(event.target.value)}
            >
              <option value="faturamento">Faturamento</option>
              <option value="ticketMedio">Ticket médio</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filiais (mínimo 2)</label>

            {filiais.map((filial) => (
              <label key={filial.id}>
                <input
                  type="checkbox"
                  checked={selecionadas.includes(filial.id)}
                  onChange={() => alternarFilial(filial.id)}
                />{" "}
                {filial.nome}
              </label>
            ))}
          </div>
        </div>

        {erro && <p className="login-error">{erro}</p>}

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Melhor desempenho</span>

            <strong>{melhorFilial?.filial || "-"}</strong>

            <small>
              maior {ordenarPor === "ticketMedio" ? "ticket médio" : "faturamento"}{" "}
              no período
            </small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">
              {ordenarPor === "ticketMedio" ? "Maior ticket médio" : "Maior faturamento"}
            </span>

            <strong>R$ {formatarMoeda(melhorFilial?.[ordenarPor] || 0)}</strong>

            <small>{melhorFilial?.filial || "-"}</small>
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
                <tr key={filial.filialId}>
                  <td>
                    <strong>{filial.filial}</strong>
                  </td>

                  <td>{cidades[filial.filialId]}</td>

                  <td>{filial.totalVendas}</td>

                  <td>R$ {formatarMoeda(filial.faturamento)}</td>

                  <td>R$ {formatarMoeda(filial.ticketMedio)}</td>
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

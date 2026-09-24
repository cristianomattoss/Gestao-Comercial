import "./Dashboard.css";
import { useState } from "react";

import {
  getFiliais,
  getProdutos,
  getCategorias,
  getVendas,
} from "../services/pdvService";

import { ESTADOS } from "../models/AppState";
import Sidebar from "../components/Sidebar";
import { meses } from "../data/pdvData";

function Vendas({ usuario, onLogout }) {
  const filiais = getFiliais();
  const produtos = getProdutos();
  const categorias = getCategorias();
  const vendas = getVendas();

  const [filialSelecionada, setFilialSelecionada] = useState(
    usuario?.perfil === ESTADOS.ADMIN ? "todas" : usuario?.filial || "",
  );

  const [mesSelecionado, setMesSelecionado] = useState("2026-09");

  const vendasFiltradas = vendas.filter((venda) => {
    const mesmaData = venda.mes === mesSelecionado;

    if (usuario?.perfil === ESTADOS.ADMIN) {
      const mesmaFilial =
        filialSelecionada === "todas" ||
        venda.filialId === Number(filialSelecionada);

      return mesmaData && mesmaFilial;
    }

    const filial = filiais.find((filial) => filial.nome === usuario?.filial);

    return mesmaData && venda.filialId === filial?.id;
  });

  const faturamento = vendasFiltradas.reduce(
    (total, venda) => total + venda.valorTotal,
    0,
  );

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin={usuario?.perfil === ESTADOS.ADMIN} />

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
              <strong>
                {usuario?.perfil === ESTADOS.ADMIN ? "Administrador" : "Gestor"}
              </strong>

              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-filters">
          <div className="filter-group">
            <label>Filial</label>

            {usuario?.perfil === ESTADOS.ADMIN ? (
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

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Total de vendas</span>

            <strong>{vendasFiltradas.length}</strong>

            <small>vendas no período</small>
          </div>

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
              {vendasFiltradas.map((venda) => {
                const produto = produtos.find(
                  (produto) => produto.id === venda.produtoId,
                );

                const categoria = categorias.find(
                  (categoria) => categoria.id === produto?.categoriaId,
                );

                return (
                  <tr key={venda.id}>
                    <td>{produto?.nome}</td>

                    <td>{categoria?.nome}</td>

                    <td>{venda.quantidade}</td>

                    <td>
                      R${" "}
                      {venda.valorTotal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
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

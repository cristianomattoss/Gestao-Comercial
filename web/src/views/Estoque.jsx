import "./Dashboard.css";
import { useState } from "react";
import { ESTADOS } from "../models/AppState";

import {
  getFiliais,
  getEstoque,
  getProdutos,
  getCategorias,
} from "../services/pdvService";
import Sidebar from "../components/Sidebar";

function Estoque({ usuario, onLogout }) {
  const filiais = getFiliais();
  const estoque = getEstoque();
  const produtos = getProdutos();
  const categorias = getCategorias();

  const [filialSelecionada, setFilialSelecionada] = useState(
    usuario?.perfil === ESTADOS.ADMIN ? "todas" : usuario?.filial || "",
  );

  const filial = filiais.find((filial) => filial.nome === usuario?.filial);

  const estoqueFilial = estoque.filter((item) => {
    if (usuario?.perfil === ESTADOS.ADMIN) {
      return (
        filialSelecionada === "todas" ||
        item.filialId === Number(filialSelecionada)
      );
    }

    return item.filialId === filial?.id;
  });

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin={usuario?.perfil === ESTADOS.ADMIN} />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Estoque</h1>

            <p>Consulte o estoque dos produtos da sua filial</p>
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
        </div>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Produtos</span>

            <strong>{estoqueFilial.length}</strong>

            <small>produtos em estoque</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Estoque baixo</span>

            <strong>
              {
                estoqueFilial.filter(
                  (item) => item.quantidade <= item.estoqueMinimo,
                ).length
              }
            </strong>

            <small>produtos precisam de atenção</small>
          </div>
        </section>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Estoque da filial</h2>

              <p>Dados provenientes do banco de dados do PDV</p>
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
                  (produto) => produto.id === item.produtoId,
                );

                const categoria = categorias.find(
                  (categoria) => categoria.id === produto?.categoriaId,
                );

                const estoqueBaixo = item.quantidade <= item.estoqueMinimo;

                return (
                  <tr key={`${item.filialId}-${item.produtoId}`}>
                    <td>{produto?.nome}</td>

                    <td>{categoria?.nome}</td>

                    <td className={estoqueBaixo ? "stock-low" : ""}>
                      {item.quantidade}
                    </td>

                    <td>{item.estoqueMinimo}</td>

                    <td className={estoqueBaixo ? "stock-low" : ""}>
                      {estoqueBaixo ? "Estoque baixo" : "Normal"}
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

import "./Dashboard.css";
import { useEffect, useState } from "react";
import { ESTADOS } from "../models/AppState";

import { carregarFiliais } from "../controllers/filialController";
import {
  carregarCategorias,
  carregarEstoque,
} from "../controllers/estoqueController";
import Sidebar from "../components/Sidebar";

function Estoque({ usuario, onLogout }) {
  const ehAdmin = usuario?.perfil === ESTADOS.ADMIN;

  const [filiais, setFiliais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [itens, setItens] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState("");

  const [filialSelecionada, setFilialSelecionada] = useState(
    ehAdmin ? "todas" : usuario?.filial || "",
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [situacaoSelecionada, setSituacaoSelecionada] = useState("");

  useEffect(() => {
    if (ehAdmin) {
      carregarFiliais()
        .then(setFiliais)
        .catch((e) => setErro(e.message));
    }

    carregarCategorias()
      .then(setCategorias)
      .catch((e) => setErro(e.message));
  }, [ehAdmin]);

  useEffect(() => {
    let ativo = true;

    carregarEstoque({
      filialId:
        ehAdmin && filialSelecionada !== "todas"
          ? filialSelecionada
          : undefined,
      categoriaId: categoriaSelecionada,
      situacao: situacaoSelecionada,
    })
      .then((dados) => {
        if (!ativo) return;

        setItens(dados.itens);
        setResumo(dados.resumo);
        setErro("");
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      });

    return () => {
      ativo = false;
    };
  }, [ehAdmin, filialSelecionada, categoriaSelecionada, situacaoSelecionada]);

  const totalProdutos = resumo
    ? Object.values(resumo).reduce((soma, quantidade) => soma + quantidade, 0)
    : 0;
  const precisamAtencao = resumo ? resumo.BAIXO + resumo.SEM_ESTOQUE : 0;

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin={ehAdmin} />

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
            <label>Categoria</label>

            <select
              value={categoriaSelecionada}
              onChange={(event) => setCategoriaSelecionada(event.target.value)}
            >
              <option value="">Todas as categorias</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Situação</label>

            <select
              value={situacaoSelecionada}
              onChange={(event) => setSituacaoSelecionada(event.target.value)}
            >
              <option value="">Todas as situações</option>
              <option value="NORMAL">Normal</option>
              <option value="ATENCAO">Atenção</option>
              <option value="BAIXO">Baixo</option>
              <option value="SEM_ESTOQUE">Sem estoque</option>
            </select>
          </div>
        </div>

        {erro && <p className="login-error">{erro}</p>}

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Produtos</span>

            <strong>{totalProdutos}</strong>

            <small>produtos em estoque</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Estoque baixo</span>

            <strong>{precisamAtencao}</strong>

            <small>produtos precisam de reposição</small>
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
              {itens.map((item) => {
                const exigeReposicao = item.situacao?.exigeReposicao;

                return (
                  <tr key={`${item.filialId}-${item.produtoId}`}>
                    <td>{item.produto}</td>

                    <td>{item.categoria}</td>

                    <td className={exigeReposicao ? "stock-low" : ""}>
                      {item.quantidade}
                    </td>

                    <td>{item.estoqueMinimo ?? "—"}</td>

                    <td className={exigeReposicao ? "stock-low" : ""}>
                      {item.situacao?.descricao ?? "Sem classificação"}
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

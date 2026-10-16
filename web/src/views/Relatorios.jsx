import "./Dashboard.css";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { carregarFiliais } from "../controllers/filialController";
import { carregarCategorias } from "../controllers/estoqueController";
import {
  FORMATOS_EXPORTACAO,
  TIPOS_RELATORIO,
  carregarProdutos,
  carregarRecentes,
  exportar,
  gerarRelatorio,
  nomeDoTipo,
} from "../controllers/relatorioController";
import { ESTADOS } from "../models/AppState";
import { meses } from "../data/meses";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarValor(coluna, valor) {
  if (valor === null || valor === undefined) return "—";

  return coluna.tipo === "moeda" ? moeda.format(valor) : valor;
}

function descreverPeriodo(parametros) {
  if (!parametros.periodoInicio) return "Posição atual";

  return parametros.periodoInicio === parametros.periodoFim
    ? parametros.periodoInicio
    : `${parametros.periodoInicio} a ${parametros.periodoFim}`;
}

function BotoesExportacao({ id, aoExportar, ocupado }) {
  return (
    <div className="form-actions">
      {FORMATOS_EXPORTACAO.map((formato) => (
        <button
          key={formato.valor}
          className="secondary-button"
          disabled={ocupado}
          onClick={() => aoExportar(id, formato.valor)}
        >
          {formato.nome}
        </button>
      ))}
    </div>
  );
}

function Relatorios({ usuario, onLogout }) {
  const ehAdmin = usuario?.perfil === ESTADOS.ADMIN;

  const [filiais, setFiliais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [recentes, setRecentes] = useState([]);

  const [tipo, setTipo] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("2026-09");
  const [periodoFim, setPeriodoFim] = useState("2026-09");
  const [filialId, setFilialId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [produtoId, setProdutoId] = useState("");

  const [previa, setPrevia] = useState(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  const tipoAtual = TIPOS_RELATORIO.find((item) => item.valor === tipo);

  useEffect(() => {
    const falhar = (e) => setErro(e.message);

    if (ehAdmin) carregarFiliais().then(setFiliais).catch(falhar);
    carregarCategorias().then(setCategorias).catch(falhar);
    carregarProdutos().then(setProdutos).catch(falhar);
    carregarRecentes().then(setRecentes).catch(falhar);
  }, [ehAdmin]);

  const produtosDaCategoria = categoriaId
    ? produtos.filter((produto) => produto.categoriaId === Number(categoriaId))
    : produtos;

  function alterarCategoria(valor) {
    setCategoriaId(valor);
    setProdutoId("");
  }

  async function handleGerar(event) {
    event.preventDefault();

    setErro("");
    setOcupado(true);

    try {
      const relatorio = await gerarRelatorio({
        tipo,
        periodoInicio,
        periodoFim,
        filialId: ehAdmin ? filialId : undefined,
        categoriaId,
        produtoId,
      });

      setPrevia(relatorio);
      setRecentes(await carregarRecentes());
    } catch (e) {
      setPrevia(null);
      setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  async function handleExportar(id, formato) {
    setErro("");
    setOcupado(true);

    try {
      await exportar(id, formato);
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin={ehAdmin} />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Relatórios</h1>

            <p>Gere relatórios gerenciais e exporte em PDF, Excel ou CSV</p>
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

        <form className="dashboard-card" onSubmit={handleGerar}>
          <div className="card-header">
            <div>
              <h2>Novo relatório</h2>

              <p>Escolha o tipo e os filtros do relatório</p>
            </div>
          </div>

          <div className="dashboard-filters">
            <div className="filter-group">
              <label htmlFor="tipo">Tipo de relatório</label>

              <select
                id="tipo"
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}
              >
                <option value="">Selecione...</option>

                {TIPOS_RELATORIO.map((item) => (
                  <option key={item.valor} value={item.valor}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>

            {tipoAtual?.usaPeriodo && (
              <>
                <div className="filter-group">
                  <label htmlFor="periodoInicio">De</label>

                  <select
                    id="periodoInicio"
                    value={periodoInicio}
                    onChange={(event) => setPeriodoInicio(event.target.value)}
                  >
                    {meses.map((mes) => (
                      <option key={mes.valor} value={mes.valor}>
                        {mes.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="periodoFim">Até</label>

                  <select
                    id="periodoFim"
                    value={periodoFim}
                    onChange={(event) => setPeriodoFim(event.target.value)}
                  >
                    {meses.map((mes) => (
                      <option key={mes.valor} value={mes.valor}>
                        {mes.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="filter-group">
              <label htmlFor="filial">Filial</label>

              {ehAdmin ? (
                <select
                  id="filial"
                  value={filialId}
                  onChange={(event) => setFilialId(event.target.value)}
                >
                  <option value="">Todas as filiais</option>

                  {filiais.map((filial) => (
                    <option key={filial.id} value={filial.id}>
                      {filial.nome}
                    </option>
                  ))}
                </select>
              ) : (
                <select id="filial" value={usuario?.filial || ""} disabled>
                  <option value={usuario?.filial}>{usuario?.filial}</option>
                </select>
              )}
            </div>

            <div className="filter-group">
              <label htmlFor="categoria">Categoria</label>

              <select
                id="categoria"
                value={categoriaId}
                onChange={(event) => alterarCategoria(event.target.value)}
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
              <label htmlFor="produto">Produto</label>

              <select
                id="produto"
                value={produtoId}
                onChange={(event) => setProdutoId(event.target.value)}
              >
                <option value="">Todos os produtos</option>

                {produtosDaCategoria.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {erro && <p className="login-error">{erro}</p>}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={ocupado}>
              Gerar prévia
            </button>
          </div>
        </form>

        {previa && (
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>{previa.titulo}</h2>

                <p>{descreverPeriodo(previa.parametros)}</p>
              </div>

              {!previa.vazio && (
                <BotoesExportacao
                  id={previa.id}
                  aoExportar={handleExportar}
                  ocupado={ocupado}
                />
              )}
            </div>

            {previa.vazio ? (
              <p>Não há resultados para o recorte selecionado.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    {previa.colunas.map((coluna) => (
                      <th key={coluna.chave}>{coluna.titulo}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {previa.linhas.map((linha, indice) => (
                    <tr key={indice}>
                      {previa.colunas.map((coluna) => (
                        <td key={coluna.chave}>
                          {formatarValor(coluna, linha[coluna.chave])}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {previa.colunas.some((c) => c.chave in previa.totais) && (
                    <tr>
                      {previa.colunas.map((coluna, indice) => (
                        <td key={coluna.chave}>
                          <strong>
                            {coluna.chave in previa.totais
                              ? formatarValor(coluna, previa.totais[coluna.chave])
                              : indice === 0
                                ? "Total"
                                : ""}
                          </strong>
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Relatórios recentes</h2>

              <p>Exporte novamente um relatório já gerado</p>
            </div>
          </div>

          {recentes.length === 0 ? (
            <p>Nenhum relatório gerado ainda.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Relatório</th>
                  <th>Período</th>
                  <th>Gerado em</th>
                  <th>Exportar</th>
                </tr>
              </thead>

              <tbody>
                {recentes.map((recente) => (
                  <tr key={recente.id}>
                    <td>{nomeDoTipo(recente.tipo)}</td>

                    <td>{descreverPeriodo(recente.parametros)}</td>

                    <td>{new Date(recente.criadoEm).toLocaleString("pt-BR")}</td>

                    <td>
                      <BotoesExportacao
                        id={recente.id}
                        aoExportar={handleExportar}
                        ocupado={ocupado}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

export default Relatorios;

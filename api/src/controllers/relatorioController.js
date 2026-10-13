import * as relatorioModel from "../models/relatorioModel.js";
import { RelatorioBuilder } from "../models/relatorio.js";
import { exportar } from "../exportacao/index.js";
import { descreverFiltros } from "../exportacao/formatacao.js";
import { notFound } from "../errors.js";
import { lerId, lerIdOpcional } from "../validacao.js";

const semValor = (valor) => (valor === null || valor === "" ? undefined : valor);

// Monta o relatório com chamadas encadeadas; a validação acontece em construir().
function montar(usuario, parametros = {}, formato) {
  return new RelatorioBuilder(usuario)
    .definirTipo(semValor(parametros.tipo))
    .definirPeriodo(semValor(parametros.periodoInicio), semValor(parametros.periodoFim))
    .definirFilial(lerIdOpcional(semValor(parametros.filialId), "filialId"))
    .definirCategoria(lerIdOpcional(semValor(parametros.categoriaId), "categoriaId"))
    .definirProduto(lerIdOpcional(semValor(parametros.produtoId), "produtoId"))
    .definirFormato(formato);
}

// UC07 passos 2 a 5: compõe, valida, gera a prévia e registra no histórico.
export async function gerar(req, res) {
  const relatorio = montar(req.usuario, req.body).construir();
  const dados = await relatorioModel.gerarDados(relatorio);
  const registro = await relatorioModel.registrarHistorico(req.usuario.id, relatorio);

  res.status(201).json({
    id: registro.id,
    titulo: relatorio.titulo,
    parametros: relatorio.parametros(),
    geradoEm: registro.criadoEm,
    vazio: dados.linhas.length === 0, // 5a: nenhum dado no recorte
    ...dados,
  });
}

export async function recentes(req, res) {
  res.json(await relatorioModel.listarRecentes(req.usuario.id));
}

// UC07 passos 6 e 7: reconstrói o relatório do histórico e exporta no formato pedido.
export async function exportarRelatorio(req, res) {
  const id = lerId(req.params.id);
  const registro = await relatorioModel.buscarDoHistorico(id, req.usuario.id);

  if (!registro) throw notFound("Relatório não encontrado no histórico.");

  const formato = String(req.query.formato ?? "").toUpperCase() || undefined;
  const relatorio = montar(req.usuario, registro.parametros, formato).construir({
    exigirFormato: true,
  });
  const [dados, nomes] = await Promise.all([
    relatorioModel.gerarDados(relatorio),
    relatorioModel.nomesDosFiltros(relatorio),
  ]);
  const geradoEm = new Date();
  const arquivo = await exportar(relatorio.formato, {
    titulo: relatorio.titulo,
    filtros: descreverFiltros(relatorio.parametros(), nomes),
    geradoEm,
    ...dados,
  });

  res
    .type(arquivo.tipo)
    .attachment(`relatorio-${relatorio.tipo.toLowerCase()}-${id}.${arquivo.extensao}`)
    .send(arquivo.conteudo);
}

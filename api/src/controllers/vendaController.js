import * as vendaModel from "../models/vendaModel.js";
import { badRequest } from "../errors.js";
import {
  lerId,
  lerFormaPagamentoOpcional,
  lerIdOpcional,
  lerMes,
  resolverEscopoFilial,
} from "../validacao.js";

// Lê mês e filial da query e aplica o escopo do perfil antes de qualquer consulta.
function lerFiltros(req) {
  const mes = lerMes(req.query.mes);
  const filialId = resolverEscopoFilial(
    req.usuario,
    lerIdOpcional(req.query.filialId, "filialId"),
  );

  return { mes, filialId };
}

// RF03 / UC04: lista de vendas + indicadores consolidados.
export async function listar(req, res) {
  const filtros = {
    ...lerFiltros(req),
    formaPagamento: lerFormaPagamentoOpcional(req.query.formaPagamento),
  };
  const [vendas, indicadores] = await Promise.all([
    vendaModel.listar(filtros),
    vendaModel.indicadores(filtros),
  ]);

  res.json({ ...filtros, indicadores, vendas });
}

// RF06 / RF12: desempenho consolidado do mês.
export async function resumo(req, res) {
  const filtros = lerFiltros(req);

  res.json({ ...filtros, indicadores: await vendaModel.indicadores(filtros) });
}

// RF08
export async function maisVendidos(req, res) {
  const filtros = lerFiltros(req);
  const limite = req.query.limite === undefined ? 10 : lerId(req.query.limite, "limite");

  res.json(await vendaModel.maisVendidos({ ...filtros, limite }));
}

// RF09
export async function porCategoria(req, res) {
  res.json(await vendaModel.porCategoria(lerFiltros(req)));
}

// RF07 / UC06 (somente administrador, definido na rota)
export async function comparativo(req, res) {
  const mes = lerMes(req.query.mes);
  const filialIds = String(req.query.filialIds ?? "")
    .split(",")
    .filter(Boolean)
    .map((id) => lerId(id, "filialIds"));

  if (new Set(filialIds).size < 2) {
    throw badRequest("Selecione no mínimo duas filiais para comparar.");
  }

  const filiais = await vendaModel.porFilial({ mes, filialIds });
  const ordenar = req.query.ordenarPor === "ticketMedio" ? "ticketMedio" : "faturamento";

  filiais.sort((a, b) => b[ordenar] - a[ordenar]);

  res.json({ mes, ordenadoPor: ordenar, filiais });
}

// UC08 passo 5: faturamento e participação de cada filial (somente administrador).
export async function participacaoPorFilial(req, res) {
  const mes = lerMes(req.query.mes);
  const filiais = await vendaModel.porFilial({ mes });
  const total = filiais.reduce((soma, f) => soma + f.faturamento, 0);

  res.json({
    mes,
    filiais: filiais.map((f) => ({
      ...f,
      participacao: total > 0 ? f.faturamento / total : 0,
    })),
  });
}

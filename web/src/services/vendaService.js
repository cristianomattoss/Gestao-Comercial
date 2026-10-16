import { requisitar } from "./api";

export function consultarVendas({ mes, filialId, formaPagamento }) {
  const consulta = new URLSearchParams({ mes });

  if (filialId) consulta.set("filialId", filialId);
  if (formaPagamento) consulta.set("formaPagamento", formaPagamento);

  return requisitar(`/vendas?${consulta.toString()}`);
}

export function consultarResumo({ mes, filialId }) {
  const consulta = new URLSearchParams({ mes });

  if (filialId) consulta.set("filialId", filialId);

  return requisitar(`/vendas/resumo?${consulta.toString()}`);
}

export function consultarMaisVendidos({ mes, filialId, limite = 5 }) {
  const consulta = new URLSearchParams({ mes, limite });

  if (filialId) consulta.set("filialId", filialId);

  return requisitar(`/vendas/mais-vendidos?${consulta.toString()}`);
}

export function consultarParticipacaoFiliais({ mes }) {
  return requisitar(`/vendas/participacao-filiais?mes=${mes}`);
}

export function consultarComparativo({ mes, filialIds, ordenarPor }) {
  const consulta = new URLSearchParams({
    mes,
    filialIds: filialIds.join(","),
    ordenarPor,
  });

  return requisitar(`/vendas/comparativo?${consulta.toString()}`);
}

import {
  consultarComparativo,
  consultarMaisVendidos,
  consultarParticipacaoFiliais,
  consultarResumo,
  consultarVendas,
} from "../services/vendaService";
import { consultarEstoque } from "../services/estoqueService";

// O gestor não envia filial: a API aplica o escopo do perfil (RN12).
export function carregarVendas({ mes, filialId, formaPagamento }) {
  return consultarVendas({ mes, filialId, formaPagamento });
}

// Dashboard do gestor: a API restringe tudo à filial vinculada (RN12).
export async function carregarDashboardGestor(mes) {
  const [resumo, maisVendidos, estoque] = await Promise.all([
    consultarResumo({ mes }),
    consultarMaisVendidos({ mes }),
    consultarEstoque({}),
  ]);

  return {
    indicadores: resumo.indicadores,
    maisVendidos,
    estoqueBaixo: estoque.itens.filter((item) => item.situacao?.exigeReposicao),
  };
}

// UC08: o administrador vê também faturamento e participação por filial.
export async function carregarDashboardAdmin(mes) {
  const [resumo, participacao, estoque] = await Promise.all([
    consultarResumo({ mes }),
    consultarParticipacaoFiliais({ mes }),
    consultarEstoque({}),
  ]);

  return {
    indicadores: resumo.indicadores,
    filiais: participacao.filiais,
    estoqueBaixo: estoque.itens.filter((item) => item.situacao?.exigeReposicao),
  };
}

// RN08: mínimo de duas filiais, mesmo período e mesmos indicadores.
export function compararFiliais({ mes, filialIds, ordenarPor }) {
  if (filialIds.length < 2) {
    return Promise.reject(
      new Error("Selecione no mínimo duas filiais para comparar."),
    );
  }

  return consultarComparativo({ mes, filialIds, ordenarPor });
}

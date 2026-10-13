import { badRequest } from "../errors.js";
import { resolverEscopoFilial } from "../validacao.js";

// Padrão Builder: o relatório tem muitos parâmetros opcionais, compostos de forma
// incremental; toda a validação acontece em construir() (UC07, RN03, RN04, RN12).

const MES = /^\d{4}-(0[1-9]|1[0-2])$/;

export const TipoRelatorio = Object.freeze({
  VENDAS: "VENDAS",
  VENDAS_POR_FILIAL: "VENDAS_POR_FILIAL",
  VENDAS_POR_CATEGORIA: "VENDAS_POR_CATEGORIA",
  MAIS_VENDIDOS: "MAIS_VENDIDOS",
  ESTOQUE: "ESTOQUE",
});

export const FormatoExportacao = Object.freeze({
  PDF: "PDF",
  EXCEL: "EXCEL",
  CSV: "CSV",
});

// O estoque é uma posição atual; os demais relatórios dependem do período.
const TIPOS_SEM_PERIODO = [TipoRelatorio.ESTOQUE];

export const TITULOS = {
  [TipoRelatorio.VENDAS]: "Relatório de vendas",
  [TipoRelatorio.VENDAS_POR_FILIAL]: "Vendas por filial",
  [TipoRelatorio.VENDAS_POR_CATEGORIA]: "Vendas por categoria",
  [TipoRelatorio.MAIS_VENDIDOS]: "Produtos mais vendidos",
  [TipoRelatorio.ESTOQUE]: "Relatório de estoque",
};

export class Relatorio {
  constructor({ tipo, periodoInicio, periodoFim, filialId, categoriaId, produtoId, formato }) {
    this.tipo = tipo;
    this.periodoInicio = periodoInicio;
    this.periodoFim = periodoFim;
    this.filialId = filialId;
    this.categoriaId = categoriaId;
    this.produtoId = produtoId;
    this.formato = formato;
    Object.freeze(this);
  }

  get titulo() {
    return TITULOS[this.tipo];
  }

  // Parâmetros que identificam o recorte; é o que vai para o histórico.
  parametros() {
    return {
      tipo: this.tipo,
      periodoInicio: this.periodoInicio,
      periodoFim: this.periodoFim,
      filialId: this.filialId,
      categoriaId: this.categoriaId,
      produtoId: this.produtoId,
    };
  }
}

export class RelatorioBuilder {
  constructor(usuario) {
    this.usuario = usuario;
    this.dados = {};
  }

  definirTipo(tipo) {
    this.dados.tipo = tipo;
    return this;
  }

  definirPeriodo(inicio, fim) {
    this.dados.periodoInicio = inicio;
    this.dados.periodoFim = fim;
    return this;
  }

  definirFilial(filialId) {
    this.dados.filialId = filialId;
    return this;
  }

  definirCategoria(categoriaId) {
    this.dados.categoriaId = categoriaId;
    return this;
  }

  definirProduto(produtoId) {
    this.dados.produtoId = produtoId;
    return this;
  }

  definirFormato(formato) {
    this.dados.formato = formato;
    return this;
  }

  construir({ exigirFormato = false } = {}) {
    const { tipo, periodoInicio, periodoFim, filialId, formato } = this.dados;
    const usaPeriodo = !TIPOS_SEM_PERIODO.includes(tipo);

    // 4a: parâmetros obrigatórios ausentes
    const faltando = [];
    if (!tipo) faltando.push("tipo");
    if (tipo && usaPeriodo && !periodoInicio) faltando.push("período inicial");
    if (tipo && usaPeriodo && !periodoFim) faltando.push("período final");
    if (exigirFormato && !formato) faltando.push("formato de exportação");

    if (faltando.length > 0) {
      throw badRequest(`Parâmetros obrigatórios ausentes: ${faltando.join(", ")}.`);
    }

    if (!Object.values(TipoRelatorio).includes(tipo)) {
      throw badRequest(`Tipo de relatório inválido. Use: ${Object.values(TipoRelatorio).join(", ")}.`);
    }

    if (formato !== undefined && !Object.values(FormatoExportacao).includes(formato)) {
      throw badRequest(`Formato inválido. Use: ${Object.values(FormatoExportacao).join(", ")}.`);
    }

    if (usaPeriodo) {
      if (!MES.test(periodoInicio) || !MES.test(periodoFim)) {
        throw badRequest("Informe o período no formato AAAA-MM.");
      }

      if (periodoInicio > periodoFim) {
        throw badRequest("O período inicial não pode ser posterior ao período final.");
      }
    }

    // RN12: o gestor só gera relatórios da filial a que está vinculado.
    const filialPermitida = resolverEscopoFilial(this.usuario, filialId);

    return new Relatorio({
      ...this.dados,
      periodoInicio: usaPeriodo ? periodoInicio : undefined,
      periodoFim: usaPeriodo ? periodoFim : undefined,
      filialId: filialPermitida,
    });
  }
}

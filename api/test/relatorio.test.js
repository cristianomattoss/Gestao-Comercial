// Testes do RelatorioBuilder e da exportação; não dependem do banco.
import { test } from "node:test";
import assert from "node:assert/strict";

const { RelatorioBuilder, TipoRelatorio, FormatoExportacao } = await import(
  "../src/models/relatorio.js"
);
const { gerarCsv } = await import("../src/exportacao/csv.js");
const { gerarExcel } = await import("../src/exportacao/excel.js");
const { gerarPdf } = await import("../src/exportacao/pdf.js");

const admin = { id: 1, perfil: "ADMIN", filialId: null };
const gestor = { id: 2, perfil: "GESTOR", filialId: 1 };

const base = (usuario) =>
  new RelatorioBuilder(usuario)
    .definirTipo(TipoRelatorio.VENDAS_POR_FILIAL)
    .definirPeriodo("2026-07", "2026-09");

test("Builder: constrói relatório válido com parâmetros opcionais", () => {
  const relatorio = base(admin)
    .definirFilial(2)
    .definirFormato(FormatoExportacao.PDF)
    .construir();

  assert.equal(relatorio.tipo, "VENDAS_POR_FILIAL");
  assert.equal(relatorio.filialId, 2);
  assert.equal(relatorio.categoriaId, undefined);
  assert.equal(relatorio.formato, "PDF");
  assert.throws(() => {
    "use strict";
    relatorio.tipo = "ESTOQUE";
  }, TypeError);
});

test("Builder: sinaliza parâmetros obrigatórios ausentes (UC07 4a)", () => {
  assert.throws(() => new RelatorioBuilder(admin).construir(), {
    status: 400,
    message: /tipo/,
  });
  assert.throws(
    () => new RelatorioBuilder(admin).definirTipo(TipoRelatorio.VENDAS).construir(),
    { status: 400, message: /período inicial, período final/ },
  );
  assert.throws(() => base(admin).construir({ exigirFormato: true }), {
    status: 400,
    message: /formato/,
  });
});

test("Builder: valida período e formato", () => {
  assert.throws(
    () => base(admin).definirPeriodo("2026-09", "2026-07").construir(),
    { status: 400, message: /posterior/ },
  );
  assert.throws(() => base(admin).definirPeriodo("2026-13", "2026-14").construir(), {
    status: 400,
    message: /AAAA-MM/,
  });
  assert.throws(() => base(admin).definirFormato("DOC").construir(), {
    status: 400,
    message: /Formato inválido/,
  });
  assert.throws(() => base(admin).definirTipo("OUTRO").construir(), {
    status: 400,
    message: /Tipo de relatório inválido/,
  });
});

test("Builder: estoque não exige período", () => {
  const relatorio = new RelatorioBuilder(admin)
    .definirTipo(TipoRelatorio.ESTOQUE)
    .construir();

  assert.equal(relatorio.periodoInicio, undefined);
});

test("Builder: RN12 restringe o gestor à própria filial", () => {
  assert.equal(base(gestor).construir().filialId, 1);
  assert.equal(base(gestor).definirFilial(1).construir().filialId, 1);
  assert.throws(() => base(gestor).definirFilial(2).construir(), { status: 403 });
});

const conteudo = {
  titulo: "Vendas por filial",
  filtros: ["Período: 2026-07 a 2026-09"],
  geradoEm: new Date("2026-10-13T12:00:00Z"),
  colunas: [
    { chave: "filial", titulo: "Filial", tipo: "texto" },
    { chave: "faturamento", titulo: "Faturamento", tipo: "moeda", soma: true },
  ],
  linhas: [
    { filial: "Centro; \"Matriz\"", faturamento: 1234.5 },
    { filial: "=HYPERLINK(\"x\")", faturamento: 10 },
  ],
  totais: { faturamento: 1244.5 },
};

test("CSV: separador, decimal, escape e proteção contra fórmula", () => {
  const { conteudo: buffer, extensao } = gerarCsv(conteudo);
  const texto = buffer.toString("utf-8");

  assert.equal(extensao, "csv");
  assert.ok(texto.startsWith("﻿Filial;Faturamento"));
  assert.ok(texto.includes('"Centro; ""Matriz""";1234,50'));
  assert.ok(texto.includes("'=HYPERLINK"));
  assert.ok(texto.includes("Total;1244,50"));
});

test("Excel e PDF: geram arquivos com a assinatura correta", async () => {
  const excel = await gerarExcel(conteudo);
  const pdf = await gerarPdf(conteudo);

  assert.equal(excel.conteudo.subarray(0, 2).toString(), "PK");
  assert.equal(pdf.conteudo.subarray(0, 5).toString(), "%PDF-");
});

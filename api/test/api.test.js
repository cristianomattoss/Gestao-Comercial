// Testes que não dependem do banco: regras de domínio, escopo por perfil e validações.
// Rodar com: npm test -w api
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

process.env.DATABASE_URL ??= "postgres://x:x@localhost:5432/x";
process.env.JWT_SECRET ??= "segredo-de-teste";

const { Estoque } = await import("../src/models/situacaoEstoque.js");
const { resolverEscopoFilial, lerDadosUsuario } = await import("../src/validacao.js");
const { app } = await import("../src/app.js");
const { pool } = await import("../src/db.js");

const item = (quantidade, estoqueMinimo) =>
  new Estoque({ produto: "Arroz 5kg", quantidade, estoqueMinimo });

test("State: classifica a situação do estoque", () => {
  assert.equal(item(0, 10).situacao.codigo, "SEM_ESTOQUE");
  assert.equal(item(10, 10).situacao.codigo, "BAIXO");
  assert.equal(item(15, 10).situacao.codigo, "ATENCAO");
  assert.equal(item(16, 10).situacao.codigo, "NORMAL");
  assert.equal(item(5, null).situacao, null);
});

test("State: RN07 e alertas", () => {
  assert.equal(item(10, 10).verificarEstoqueBaixo(), true);
  assert.equal(item(11, 10).verificarEstoqueBaixo(), false);
  assert.equal(item(30, 10).gerarAlerta(), null);
  assert.equal(item(0, 10).gerarAlerta().nivel, "critico");
});

test("escopo: gestor limitado à própria filial, admin livre", () => {
  const gestor = { perfil: "GESTOR", filialId: 1 };
  const admin = { perfil: "ADMIN", filialId: null };

  assert.equal(resolverEscopoFilial(gestor, undefined), 1);
  assert.equal(resolverEscopoFilial(gestor, 1), 1);
  assert.throws(() => resolverEscopoFilial(gestor, 2), { status: 403 });
  assert.equal(resolverEscopoFilial(admin, undefined), undefined);
  assert.equal(resolverEscopoFilial(admin, 2), 2);
});

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

after(async () => {
  server.close();
  await pool.end();
});

const token = (perfil, filialId = null) =>
  jwt.sign({ perfil, filialId }, process.env.JWT_SECRET, { subject: "1" });

const get = (path, t) =>
  fetch(base + path, { headers: t ? { authorization: `Bearer ${t}` } : {} });

test("rotas protegidas exigem token", async () => {
  for (const rota of ["/filiais", "/vendas?mes=2026-09", "/estoque", "/produtos"]) {
    assert.equal((await get(rota)).status, 401, rota);
  }
});

test("gestor não acessa rotas de administrador", async () => {
  const t = token("GESTOR", 1);

  assert.equal((await get("/vendas/comparativo?mes=2026-09&filialIds=1,2", t)).status, 403);
  assert.equal((await get("/vendas/participacao-filiais?mes=2026-09", t)).status, 403);
  assert.equal(
    (await fetch(base + "/filiais", {
      method: "POST",
      headers: { authorization: `Bearer ${t}`, "content-type": "application/json" },
      body: JSON.stringify({ nome: "X", cidade: "Y", gerente: "Z" }),
    })).status,
    403,
  );
});

test("gestor não consulta outra filial (RN12)", async () => {
  const t = token("GESTOR", 1);

  assert.equal((await get("/vendas?mes=2026-09&filialId=2", t)).status, 403);
  assert.equal((await get("/estoque?filialId=2", t)).status, 403);
  assert.equal((await get("/filiais/2", t)).status, 403);
});

test("validações de parâmetros", async () => {
  const admin = token("ADMIN");

  assert.equal((await get("/vendas", admin)).status, 400);
  assert.equal((await get("/vendas?mes=setembro", admin)).status, 400);
  assert.equal((await get("/vendas/comparativo?mes=2026-09&filialIds=1", admin)).status, 400);
  assert.equal((await get("/estoque?situacao=XYZ", admin)).status, 400);
  assert.equal((await get("/filiais/abc", admin)).status, 400);
  assert.equal(
    (await fetch(base + "/filiais", {
      method: "POST",
      headers: { authorization: `Bearer ${admin}`, "content-type": "application/json" },
      body: JSON.stringify({ nome: "" }),
    })).status,
    400,
  );
});

const enviar = (metodo, path, t, corpo) =>
  fetch(base + path, {
    method: metodo,
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });

test("usuários: somente administrador (RN01)", async () => {
  assert.equal((await get("/usuarios")).status, 401);
  assert.equal((await get("/usuarios", token("GESTOR", 1))).status, 403);
  assert.equal(
    (await enviar("POST", "/usuarios", token("GESTOR", 1), {})).status,
    403,
  );
});

test("usuários: validações do cadastro (UC03)", async () => {
  const admin = token("ADMIN");
  const valido = { email: "novo@empresa.com", senha: "123456", perfil: "GESTOR", filialId: 1 };
  const post = (corpo) => enviar("POST", "/usuarios", admin, corpo);

  assert.equal((await post({ ...valido, email: "sem-arroba" })).status, 400);
  assert.equal((await post({ ...valido, senha: "123" })).status, 400);
  assert.equal((await post({ ...valido, perfil: "OUTRO" })).status, 400);
  assert.equal((await post({ ...valido, filialId: undefined })).status, 400); // gestor exige filial
});

test("usuários: não inativa o próprio usuário", async () => {
  const admin = token("ADMIN"); // subject "1"

  assert.equal((await enviar("PATCH", "/usuarios/1", admin, { ativo: false })).status, 400);
  assert.equal((await enviar("PATCH", "/usuarios/2", admin, { ativo: "não" })).status, 400);
});

test("validação de usuário: gestor exige filial, administrador a ignora", () => {
  const base = { email: " Gestor@Empresa.com ", senha: "123456" };

  assert.deepEqual(lerDadosUsuario({ ...base, perfil: "GESTOR", filialId: "2" }), {
    email: "gestor@empresa.com",
    senha: "123456",
    perfil: "GESTOR",
    filialId: 2,
  });
  assert.equal(lerDadosUsuario({ ...base, perfil: "ADMIN", filialId: 2 }).filialId, null);
  assert.throws(() => lerDadosUsuario({ ...base, perfil: "GESTOR" }), { status: 400 });
});

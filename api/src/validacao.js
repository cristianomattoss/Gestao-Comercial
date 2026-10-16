import { badRequest, forbidden } from "./errors.js";

const MES = /^\d{4}-(0[1-9]|1[0-2])$/;

export function lerMes(valor) {
  if (typeof valor !== "string" || !MES.test(valor)) {
    throw badRequest("Informe o mês no formato AAAA-MM.");
  }

  return valor;
}

const FORMAS_PAGAMENTO = ["DINHEIRO", "CREDITO", "DEBITO", "PIX"];

// UC04: filtro opcional por forma de pagamento (ausente = todas).
export function lerFormaPagamentoOpcional(valor) {
  if (valor === undefined || valor === "") return undefined;

  if (!FORMAS_PAGAMENTO.includes(valor)) {
    throw badRequest(
      `Forma de pagamento inválida. Use ${FORMAS_PAGAMENTO.join(", ")}.`,
    );
  }

  return valor;
}

export function lerId(valor, campo = "id") {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    throw badRequest(`Parâmetro ${campo} inválido.`);
  }

  return numero;
}

export function lerIdOpcional(valor, campo) {
  return valor === undefined || valor === "" ? undefined : lerId(valor, campo);
}

export function textoObrigatorio(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw badRequest(`O campo ${campo} é obrigatório.`);
  }

  return valor.trim();
}

// RN01/RN12: o gestor só enxerga a filial vinculada; o administrador, qualquer uma.
// Retorna o id da filial a consultar (undefined = todas, só para administrador).
export function resolverEscopoFilial(usuario, filialIdSolicitada) {
  if (usuario.perfil === "ADMIN") {
    return filialIdSolicitada;
  }

  if (
    filialIdSolicitada !== undefined &&
    filialIdSolicitada !== usuario.filialId
  ) {
    throw forbidden("O gestor só pode acessar a filial a que está vinculado.");
  }

  return usuario.filialId;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MINIMA = 6;

// UC03: e-mail válido, senha mínima, perfil conhecido e filial obrigatória para gestor.
export function lerDadosUsuario(body = {}) {
  const email = textoObrigatorio(body.email, "e-mail").toLowerCase();

  if (!EMAIL.test(email)) {
    throw badRequest("Informe um e-mail válido.");
  }

  if (typeof body.senha !== "string" || body.senha.length < SENHA_MINIMA) {
    throw badRequest(`A senha deve ter no mínimo ${SENHA_MINIMA} caracteres.`);
  }

  if (body.perfil !== "ADMIN" && body.perfil !== "GESTOR") {
    throw badRequest("Perfil inválido. Use ADMIN ou GESTOR.");
  }

  if (body.perfil === "GESTOR") {
    return {
      email,
      senha: body.senha,
      perfil: body.perfil,
      filialId: lerId(body.filialId, "filialId"),
    };
  }

  return { email, senha: body.senha, perfil: body.perfil, filialId: null };
}

function cnpjValido(cnpj) {
  if (/^(\d){13}$/.test(cnpj)) return false;

  const digito = (base) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = [...base].reduce((total, d, i) => total + Number(d) * pesos[i], 0);
    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = digito(cnpj.slice(0, 12));

  return d1 === Number(cnpj[12]) && digito(cnpj.slice(0, 12) + d1) === Number(cnpj[13]);
}

function textoOpcional(valor) {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : null;
}

// RF13: razão social, nome fantasia e CNPJ (com dígitos verificadores) são obrigatórios.
export function lerDadosEmpresa(body = {}) {
  const cnpj = String(body.cnpj ?? "").replace(/\D/g, "");

  if (!cnpjValido(cnpj)) {
    throw badRequest("Informe um CNPJ válido.");
  }

  const email = textoOpcional(body.email)?.toLowerCase() ?? null;

  if (email && !EMAIL.test(email)) {
    throw badRequest("Informe um e-mail válido.");
  }

  const estado = textoOpcional(body.estado)?.toUpperCase() ?? null;

  if (estado && !/^[A-Z]{2}$/.test(estado)) {
    throw badRequest("Informe o estado com a sigla de duas letras (UF).");
  }

  return {
    razaoSocial: textoObrigatorio(body.razaoSocial, "razão social"),
    nomeFantasia: textoObrigatorio(body.nomeFantasia, "nome fantasia"),
    cnpj,
    inscricaoEstadual: textoOpcional(body.inscricaoEstadual),
    endereco: textoOpcional(body.endereco),
    cidade: textoOpcional(body.cidade),
    estado,
    telefone: textoOpcional(body.telefone),
    email,
  };
}

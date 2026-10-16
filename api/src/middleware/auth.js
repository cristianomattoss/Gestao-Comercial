import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { pool } from "../db.js";

// Valida o token e confere no banco que o usuário ainda existe e está ativo,
// para que a inativação valha imediatamente (UC01), sem esperar o token expirar.
export async function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? "").split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  let claims;

  try {
    claims = jwt.verify(token, config.jwtSecret);
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }

  const { rows } = await pool.query("SELECT ativo FROM usuarios WHERE id = $1", [
    Number(claims.sub),
  ]);

  if (!rows[0]?.ativo) {
    return res.status(401).json({ erro: "Usuário não encontrado ou inativo." });
  }

  req.usuario = {
    id: Number(claims.sub),
    perfil: claims.perfil,
    filialId: claims.filialId,
  };
  next();
}

export function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario?.perfil)) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    next();
  };
}

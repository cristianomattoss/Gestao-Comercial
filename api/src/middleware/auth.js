import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? "").split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  try {
    const { sub, perfil, filialId } = jwt.verify(token, config.jwtSecret);
    req.usuario = { id: Number(sub), perfil, filialId };
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

export function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario?.perfil)) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    next();
  };
}

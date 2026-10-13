import { consultarVendas } from "../services/vendaService";

// O gestor não envia filial: a API aplica o escopo do perfil (RN12).
export function carregarVendas({ mes, filialId }) {
  return consultarVendas({ mes, filialId });
}

import { requisitar } from "./api";

export function consultarVendas({ mes, filialId }) {
  const consulta = new URLSearchParams({ mes });

  if (filialId) consulta.set("filialId", filialId);

  return requisitar(`/vendas?${consulta.toString()}`);
}

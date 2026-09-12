import {
  filiais,
  categorias,
  produtos,
  vendas,
  estoque,
} from "../data/pdvData";

export function getFiliais() {
  return filiais;
}

export function getCategorias() {
  return categorias;
}

export function getProdutos() {
  return produtos;
}

export function getVendas() {
  return vendas;
}

export function getEstoque() {
  return estoque;
}

export function getVendasPorFilialEMes(filialId, mes) {
  return vendas.filter(
    (venda) =>
      venda.filialId === filialId &&
      venda.mes === mes
  );
}

export function getProdutosMaisVendidos(filialId, mes) {
  const vendasFiltradas = vendas.filter(
    (venda) =>
      venda.filialId === filialId &&
      venda.mes === mes
  );

  return vendasFiltradas
    .map((venda) => {
      const produto = produtos.find(
        (produto) => produto.id === venda.produtoId
      );

      const categoria = categorias.find(
        (categoria) => categoria.id === produto?.categoriaId
      );

      return {
        nome: produto?.nome,
        categoria: categoria?.nome,
        quantidade: venda.quantidade,
      };
    })
    .sort((a, b) => b.quantidade - a.quantidade);
}

export function getEstoqueBaixo(filialId) {
  return estoque
    .filter(
      (item) =>
        item.filialId === filialId &&
        item.quantidade <= item.estoqueMinimo
    )
    .map((item) => {
      const produto = produtos.find(
        (produto) => produto.id === item.produtoId
      );

      return {
        nome: produto?.nome,
        quantidade: item.quantidade,
        estoqueMinimo: item.estoqueMinimo,
      };
    });
}
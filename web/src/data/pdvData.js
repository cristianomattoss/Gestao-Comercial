export const meses = [
  { valor: "2026-07", nome: "Julho de 2026" },
  { valor: "2026-08", nome: "Agosto de 2026" },
  { valor: "2026-09", nome: "Setembro de 2026" },
];

export const filiais = [
  {
    id: 1,
    nome: "Filial Centro",
    cidade: "Rio de Janeiro",
    gerente: "Carlos Silva",
  },
  {
    id: 2,
    nome: "Filial Norte",
    cidade: "Rio de Janeiro",
    gerente: "Ana Souza",
  },
];

export const categorias = [
  {
    id: 1,
    nome: "Alimentos",
  },
  {
    id: 2,
    nome: "Bebidas",
  },
  {
    id: 3,
    nome: "Laticínios",
  },
];

export const produtos = [
  {
    id: 1,
    nome: "Café Tradicional 500g",
    categoriaId: 1,
  },
  {
    id: 2,
    nome: "Arroz 5kg",
    categoriaId: 1,
  },
  {
    id: 3,
    nome: "Refrigerante 2L",
    categoriaId: 2,
  },
  {
    id: 4,
    nome: "Leite Integral 1L",
    categoriaId: 3,
  },
  {
    id: 5,
    nome: "Açúcar 1kg",
    categoriaId: 1,
  },
];

export const vendas = [
  // JULHO
  {
    id: 1,
    filialId: 1,
    produtoId: 1,
    quantidade: 150,
    valorTotal: 1800,
    mes: "2026-07",
  },
  {
    id: 2,
    filialId: 1,
    produtoId: 2,
    quantidade: 120,
    valorTotal: 1560,
    mes: "2026-07",
  },
  {
    id: 3,
    filialId: 1,
    produtoId: 3,
    quantidade: 100,
    valorTotal: 900,
    mes: "2026-07",
  },
  {
    id: 4,
    filialId: 2,
    produtoId: 1,
    quantidade: 130,
    valorTotal: 1560,
    mes: "2026-07",
  },
  {
    id: 5,
    filialId: 2,
    produtoId: 2,
    quantidade: 110,
    valorTotal: 1430,
    mes: "2026-07",
  },

  // AGOSTO
  {
    id: 6,
    filialId: 1,
    produtoId: 1,
    quantidade: 170,
    valorTotal: 2040,
    mes: "2026-08",
  },
  {
    id: 7,
    filialId: 1,
    produtoId: 2,
    quantidade: 135,
    valorTotal: 1755,
    mes: "2026-08",
  },
  {
    id: 8,
    filialId: 1,
    produtoId: 3,
    quantidade: 115,
    valorTotal: 1035,
    mes: "2026-08",
  },
  {
    id: 9,
    filialId: 2,
    produtoId: 1,
    quantidade: 145,
    valorTotal: 1740,
    mes: "2026-08",
  },
  {
    id: 10,
    filialId: 2,
    produtoId: 2,
    quantidade: 125,
    valorTotal: 1625,
    mes: "2026-08",
  },

  // SETEMBRO
  {
    id: 11,
    filialId: 1,
    produtoId: 1,
    quantidade: 186,
    valorTotal: 2232,
    mes: "2026-09",
  },
  {
    id: 12,
    filialId: 1,
    produtoId: 2,
    quantidade: 142,
    valorTotal: 1846,
    mes: "2026-09",
  },
  {
    id: 13,
    filialId: 1,
    produtoId: 3,
    quantidade: 128,
    valorTotal: 1152,
    mes: "2026-09",
  },
  {
    id: 14,
    filialId: 1,
    produtoId: 4,
    quantidade: 115,
    valorTotal: 575,
    mes: "2026-09",
  },
  {
    id: 15,
    filialId: 1,
    produtoId: 5,
    quantidade: 98,
    valorTotal: 490,
    mes: "2026-09",
  },
  {
    id: 16,
    filialId: 2,
    produtoId: 1,
    quantidade: 160,
    valorTotal: 1920,
    mes: "2026-09",
  },
  {
    id: 17,
    filialId: 2,
    produtoId: 2,
    quantidade: 130,
    valorTotal: 1690,
    mes: "2026-09",
  },
];

export const estoque = [
  {
    filialId: 1,
    produtoId: 1,
    quantidade: 8,
    estoqueMinimo: 10,
  },
  {
    filialId: 1,
    produtoId: 2,
    quantidade: 25,
    estoqueMinimo: 10,
  },
  {
    filialId: 1,
    produtoId: 3,
    quantidade: 32,
    estoqueMinimo: 15,
  },
  {
    filialId: 1,
    produtoId: 4,
    quantidade: 5,
    estoqueMinimo: 10,
  },
  {
    filialId: 1,
    produtoId: 5,
    quantidade: 7,
    estoqueMinimo: 8,
  },
  {
    filialId: 2,
    produtoId: 1,
    quantidade: 18,
    estoqueMinimo: 10,
  },
  {
    filialId: 2,
    produtoId: 2,
    quantidade: 6,
    estoqueMinimo: 10,
  },
  {
    filialId: 2,
    produtoId: 3,
    quantidade: 7,
    estoqueMinimo: 8,
  },
  {
    filialId: 2,
    produtoId: 4,
    quantidade: 18,
    estoqueMinimo: 10,
  },
  {
    filialId: 2,
    produtoId: 5,
    quantidade: 6,
    estoqueMinimo: 10,
  },
];

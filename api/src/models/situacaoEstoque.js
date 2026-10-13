// Padrão State: cada situação do estoque encapsula o próprio comportamento.

class SituacaoEstoque {
  constructor(codigo, descricao, exigeReposicao) {
    this.codigo = codigo;
    this.descricao = descricao;
    this._exigeReposicao = exigeReposicao;
  }

  obterDescricao() {
    return this.descricao;
  }

  exigeReposicao() {
    return this._exigeReposicao;
  }

  gerarAlerta(estoque) {
    return null;
  }
}

class EstoqueNormal extends SituacaoEstoque {
  constructor() {
    super("NORMAL", "Normal", false);
  }
}

class EstoqueAtencao extends SituacaoEstoque {
  constructor() {
    super("ATENCAO", "Atenção", false);
  }

  gerarAlerta(estoque) {
    return {
      nivel: "atencao",
      mensagem: `Estoque de ${estoque.produto} próximo do mínimo (${estoque.quantidade}/${estoque.estoqueMinimo}).`,
    };
  }
}

class EstoqueBaixo extends SituacaoEstoque {
  constructor() {
    super("BAIXO", "Baixo", true);
  }

  gerarAlerta(estoque) {
    return {
      nivel: "baixo",
      mensagem: `Estoque de ${estoque.produto} abaixo do mínimo (${estoque.quantidade}/${estoque.estoqueMinimo}). Reposição necessária.`,
    };
  }
}

class SemEstoque extends SituacaoEstoque {
  constructor() {
    super("SEM_ESTOQUE", "Sem estoque", true);
  }

  gerarAlerta(estoque) {
    return {
      nivel: "critico",
      mensagem: `${estoque.produto} sem estoque. Reposição urgente.`,
    };
  }
}

export const SITUACOES = ["NORMAL", "ATENCAO", "BAIXO", "SEM_ESTOQUE"];

export class Estoque {
  constructor({ produto, quantidade, estoqueMinimo, ...resto }) {
    Object.assign(this, resto);
    this.produto = produto;
    this.quantidade = quantidade;
    this.estoqueMinimo = estoqueMinimo;
    this.situacao = null;
    this.atualizarSituacao();
  }

  atualizarSituacao() {
    if (this.estoqueMinimo == null) {
      this.situacao = null; // UC05 5a: sem mínimo definido, sem classificação
    } else if (this.quantidade === 0) {
      this.situacao = new SemEstoque();
    } else if (this.quantidade <= this.estoqueMinimo) {
      this.situacao = new EstoqueBaixo();
    } else if (this.quantidade <= this.estoqueMinimo * 1.5) {
      this.situacao = new EstoqueAtencao();
    } else {
      this.situacao = new EstoqueNormal();
    }
  }

  verificarEstoqueBaixo() {
    return this.situacao?.exigeReposicao() ?? false;
  }

  gerarAlerta() {
    return this.situacao?.gerarAlerta(this) ?? null;
  }

  toJSON() {
    return {
      filialId: this.filialId,
      filial: this.filial,
      produtoId: this.produtoId,
      produto: this.produto,
      categoriaId: this.categoriaId,
      categoria: this.categoria,
      quantidade: this.quantidade,
      estoqueMinimo: this.estoqueMinimo,
      situacao: this.situacao && {
        codigo: this.situacao.codigo,
        descricao: this.situacao.obterDescricao(),
        exigeReposicao: this.situacao.exigeReposicao(),
      },
    };
  }
}

CREATE TABLE filiais (
  id      SERIAL PRIMARY KEY,
  nome    TEXT NOT NULL UNIQUE,
  cidade  TEXT NOT NULL,
  gerente TEXT NOT NULL
);

CREATE TABLE usuarios (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  perfil     TEXT NOT NULL CHECK (perfil IN ('ADMIN', 'GESTOR')),
  filial_id  INTEGER REFERENCES filiais(id),
  CHECK (perfil = 'ADMIN' OR filial_id IS NOT NULL)
);

CREATE TABLE categorias (
  id   SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE produtos (
  id           SERIAL PRIMARY KEY,
  nome         TEXT NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id)
);

CREATE TABLE vendas (
  id          SERIAL PRIMARY KEY,
  filial_id   INTEGER NOT NULL REFERENCES filiais(id),
  produto_id  INTEGER NOT NULL REFERENCES produtos(id),
  quantidade  INTEGER NOT NULL CHECK (quantidade > 0),
  valor_total NUMERIC(12, 2) NOT NULL,
  mes         CHAR(7) NOT NULL CHECK (mes ~ '^[0-9]{4}-(0[1-9]|1[0-2])$')
);
CREATE INDEX vendas_filial_mes_idx ON vendas (filial_id, mes);

CREATE TABLE estoque (
  filial_id      INTEGER NOT NULL REFERENCES filiais(id),
  produto_id     INTEGER NOT NULL REFERENCES produtos(id),
  quantidade     INTEGER NOT NULL CHECK (quantidade >= 0),
  estoque_minimo INTEGER NOT NULL CHECK (estoque_minimo >= 0),
  PRIMARY KEY (filial_id, produto_id)
);

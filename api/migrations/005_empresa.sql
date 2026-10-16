-- Uma única empresa por instalação (RF13): a linha fixa id = 1 é criada/atualizada via upsert.
CREATE TABLE empresa (
  id                 INTEGER PRIMARY KEY CHECK (id = 1),
  razao_social       TEXT NOT NULL,
  nome_fantasia      TEXT NOT NULL,
  cnpj               CHAR(14) NOT NULL CHECK (cnpj ~ '^[0-9]{14}$'),
  inscricao_estadual TEXT,
  endereco           TEXT,
  cidade             TEXT,
  estado             CHAR(2),
  telefone           TEXT,
  email              TEXT
);

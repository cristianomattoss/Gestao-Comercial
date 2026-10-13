CREATE TABLE relatorios_historico (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo       TEXT NOT NULL,
  parametros JSONB NOT NULL,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX relatorios_historico_usuario_idx
  ON relatorios_historico (usuario_id, criado_em DESC);

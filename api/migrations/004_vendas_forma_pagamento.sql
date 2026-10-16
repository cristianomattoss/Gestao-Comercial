ALTER TABLE vendas
  ADD COLUMN forma_pagamento TEXT
  CHECK (forma_pagamento IN ('DINHEIRO', 'CREDITO', 'DEBITO', 'PIX'));

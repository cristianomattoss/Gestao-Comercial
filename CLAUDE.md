# CLAUDE.md — Sistema de Gestão de Vendas e Estoque

Trabalho de POO (UERJ – Campus Zona Oeste, Tecnologia em Análise e Desenvolvimento de Sistemas, 2026).
A documentação de referência é o PDF na raiz: **`Trabalho POO - Sistema de Gestao de Vendas e Estoque.pdf`**
(minimundo, requisitos, padrões, rede de Petri, casos de uso, diagramas e protótipos de tela).
Em caso de dúvida sobre regra de negócio ou escopo, **o PDF prevalece**; este arquivo é um resumo.

## Estrutura do repositório (npm workspaces)
```
web/   Frontend React 19 + Vite 8 + React Router 7 (JS, CSS puro)
api/   Backend Express 5 + PostgreSQL (pg, SQL puro), JWT + bcryptjs
docker-compose.yml   Postgres 17 (db myapp, user/senha postgres, porta 5432)
```
Idioma do domínio e do código: **português** (nomes de funções, variáveis, mensagens e commits).

## Comandos (rodar na raiz)
| Comando | O que faz |
|---|---|
| `npm install` | instala os dois workspaces |
| `npm run db:up` | sobe o Postgres (requer Docker rodando) |
| `npm run db:migrate` | aplica `api/migrations/*.sql` pendentes |
| `npm run db:seed` | recarrega dados de exemplo (apaga e recria as tabelas de dados) |
| `npm run dev:api` | API em http://localhost:3000 |
| `npm run dev:web` | frontend em http://localhost:5173 |
| `npm run build` / `npm run lint` | build e lint do `web` |

- A API lê `api/.env` (modelo em `api/.env.example`; `.env` não é versionado).
- Vite 8 e ESLint 10 exigem **Node ≥ 20.19 ou ≥ 22.12**.
- Não há testes automatizados ainda.
- Usuários de seed: `admin@empresa.com`, `gestor1@empresa.com`, `gestor2@empresa.com` (senha `123456`).

## Estado atual (diverge do PDF em alguns pontos)
- O **frontend já consome a API** em login (JWT em `localStorage`), filiais, vendas, estoque, dashboards e comparativo (`web/src/services/*Service.js` → `controllers/`). Relatórios (prévia, exportação e recentes) e usuários (Configurações) também, inclusive a aba Empresa.
- A API (`api/src`, camadas `routes → controllers → models`) expõe, todos com `Authorization: Bearer <token>`:
  - `POST /auth/login`, `GET /auth/me`
  - `GET /filiais`, `GET /filiais/:id` (gestor só a própria); `POST /filiais`, `PUT /filiais/:id` (ADMIN)
  - `GET /vendas?mes=AAAA-MM[&filialId][&formaPagamento=DINHEIRO|CREDITO|DEBITO|PIX]` (lista + indicadores), `/vendas/resumo`, `/vendas/mais-vendidos[&limite]`, `/vendas/por-categoria`
  - `GET /vendas/comparativo?mes&filialIds=1,2[&ordenarPor=faturamento|ticketMedio]` e `/vendas/participacao-filiais?mes` (ADMIN)
  - `GET /estoque[?filialId&categoriaId&situacao=NORMAL|ATENCAO|BAIXO|SEM_ESTOQUE]` (itens com State, resumo e alertas)
  - `GET /categorias`, `GET /produtos[?categoriaId]`
  - `GET/PUT /empresa` (ADMIN; empresa única, `GET` devolve `null` se ainda não cadastrada; razão social, nome fantasia e CNPJ válido obrigatórios)
  - `GET/POST /usuarios`, `PATCH /usuarios/:id {ativo}` (ADMIN; e-mail único, gestor exige filialId, não inativa a si mesmo). Login de usuário inativo retorna 403
  - `POST /relatorios` (RelatorioBuilder: tipo, periodoInicio/Fim AAAA-MM, filialId, categoriaId, produtoId → prévia + registro no histórico), `GET /relatorios/recentes`, `GET /relatorios/:id/exportar?formato=PDF|EXCEL|CSV`
- O escopo do gestor (RN12) é aplicado em `resolverEscopoFilial` (`api/src/validacao.js`) antes das consultas. Testes: `npm test -w api` (não precisam de banco).
- Migrations: `002` cria `relatorios_historico`, `003` adiciona `usuarios.ativo`, `004` adiciona `vendas.forma_pagamento` (nula para vendas antigas), `005` cria `empresa` (linha única `id = 1`; o seed não a apaga). O middleware `autenticar` consulta `usuarios.ativo` a cada requisição, então inativar um usuário invalida o token na hora (401).
- O seed da API importa `web/src/data/pdvData.js`; ao remover os mocks, copiar os dados para o seed.
- O PDF prevê que as vendas venham de **bases de PDV externas** (um adaptador por filial, somente leitura) e que o banco do sistema guarde só usuários, filiais, parâmetros e histórico de relatórios. Hoje tudo fica no mesmo Postgres. Não implementar a integração PDV sem alinhar com o usuário.

## Domínio
- Software **gerencial**: não realiza vendas, só consulta e analisa dados já registrados (nunca alterar registros de origem — RN02, RN11).
- **Perfis**:
  - **Administrador**: cadastra empresa, filiais e usuários; vê todas as filiais; único que compara filiais.
  - **Gestor**: não faz cadastros; só enxerga a filial a que está vinculado (RN12); usa dashboard, vendas, estoque e relatórios.
- Entidades: Usuario (abstrata) → Administrador / Gestor (`filialVinculada`), Filial, Venda, ItemVenda, Produto, Categoria, Estoque, SituacaoEstoque, Relatorio.
- Módulos/telas: Login, Dashboard (admin e gestor), Filiais (admin), Vendas, Estoque, Comparativo (admin), Relatórios, Configurações (admin: empresa, filiais, usuários).

## Regras de negócio essenciais
- **RN01/RN12/RN13** — acesso por perfil; gestor restrito à própria filial; admin vê tudo. A checagem deve ser feita **no backend (Controller/middleware) antes de qualquer consulta**, nunca só na interface (RNF01/RNF02).
- **RN03/RN04** — indicadores respeitam o mês e a filial selecionados.
- **RN05** — faturamento = soma do valor das vendas do período.
- **RN06** — ticket médio = faturamento ÷ quantidade de vendas.
- **RN07** — estoque baixo quando `quantidade <= estoqueMinimo`.
- **RN08** — comparação entre filiais usa os mesmos indicadores e o mesmo período (mín. 2 filiais).
- **RN09** — ranking de mais vendidos por **unidades** vendidas. **RN10** — desempenho por categoria a partir das vendas dos produtos da categoria.

## Padrões de projeto exigidos
- **MVC**: Model (domínio/regras), View (telas), Controller (valida permissão do perfil, aciona o Model, escolhe a View). Controle de acesso fica no Controller.
- **State — situação do estoque** (`SituacaoEstoque` com `obterDescricao()`, `exigeReposicao()`, `gerarAlerta()`):
  - `quantidade == 0` → SemEstoque
  - `quantidade <= estoqueMinimo` → EstoqueBaixo
  - `quantidade <= estoqueMinimo * 1,5` → EstoqueAtencao
  - `quantidade > estoqueMinimo * 1,5` → EstoqueNormal
  - `Estoque.atualizarSituacao()` troca o estado; sem estoque mínimo definido, mostrar a quantidade sem classificação.
- **Builder — relatórios** (`RelatorioBuilder`: `definirTipo/Periodo/Filial/Categoria/Produto/Formato` + `construir()`). `construir()` valida parâmetros obrigatórios, período válido e escopo da filial (RN12) antes de instanciar. Exportação: PDF, Excel ou CSV.

## Casos de uso (resumo)
UC01 login (credenciais inválidas e usuário inativo tratados) · UC02 cadastrar filial · UC03 cadastrar usuário (gestor exige filial; e-mail único) · UC04 consultar vendas (filtros mês, filial, forma de pagamento) · UC05 consultar estoque (filtros filial, categoria, situação) · UC06 comparar filiais · UC07 gerar relatório (prévia → exportar; vai ao histórico de recentes) · UC08 dashboard (admin vê também faturamento e participação por filial).

## Requisitos não funcionais a respeitar
Segurança e controle de acesso (RNF01/02), desempenho com muitos registros (RNF03), usabilidade simples (RNF05), consistência dos dados (RNF06), código modular (RNF07), compatibilidade com navegadores atuais (RNF08), incluir novas filiais sem mudar a estrutura (RNF09).

## Convenções do código
- JS/JSX com ES modules, aspas duplas, ponto e vírgula, componentes React em PascalCase, `function` declaradas.
- Frontend em camadas: `models/`, `controllers/`, `services/`, `views/`, `components/`. Views recebem `usuario` e `onLogout`.
- API: `src/routes`, `src/middleware`, `src/db.js`, `src/config.js`; migrations SQL numeradas em `api/migrations/` (nunca editar uma já aplicada, criar nova).
- Commits no padrão Conventional Commits em português (`feat:`, `fix:`, `refactor:`, ...).
- Não versionar `.env` nem credenciais reais.

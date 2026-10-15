# qa-iot-control-panel

Projeto de automação de testes E2E com **Cypress**, integrado a um pipeline de CI no **GitHub Actions**. O objetivo é construir uma base de regressão confiável, rápida e de fácil manutenção, com execução automática a cada push.

> **Status atual:** v1.0 — fundação de automação e CI estabelecida. O escopo de cobertura ainda é inicial (veja [Cobertura](#cobertura-atual) e [Roadmap](#roadmap)).

---

## Stack

| Camada | Ferramenta |
| --- | --- |
| Framework E2E | Cypress `^15.11.0` |
| Linguagem | JavaScript (CommonJS) |
| CI/CD | GitHub Actions (`cypress-io/github-action@v6`) |
| Runtime | Node.js (LTS recomendado) |

---

## Estrutura do projeto

```
.
├── .github/workflows/cypress.yml   # Pipeline de CI
├── cypress/
│   ├── e2e/                        # Specs de teste
│   │   └── tst.cy.js
│   ├── fixtures/                   # Massa de dados estática
│   └── support/
│       ├── commands.js             # Custom commands
│       └── e2e.js                  # Hooks/configuração global
├── cypress.config.js               # Configuração do Cypress
└── package.json
```

---

## Cobertura atual

| Fluxo | Cenário | Tipo | Status |
| --- | --- | --- | --- |
| Carrinho | Adicionar produto ao carrinho e validar o badge | Happy path | Automatizado |

**Ambiente sob teste:** [SauceDemo](https://www.saucedemo.com), aplicação pública usada como alvo de prática. Os testes atuais **não** exercitam um painel de controle IoT real. Quando o SUT definitivo estiver disponível, a `baseUrl` e os seletores deverão ser migrados (veja o Roadmap).

---

## Como executar

### Pré-requisitos

- Node.js LTS
- npm

### Instalação

```bash
npm ci
```

### Execução

```bash
# Headless (mesmo modo usado no CI)
npx cypress run

# Modo interativo (debug e desenvolvimento de specs)
npx cypress open

# Spec específica
npx cypress run --spec "cypress/e2e/tst.cy.js"
```

---

## Pipeline de CI

Arquivo: [.github/workflows/cypress.yml](.github/workflows/cypress.yml)

- **Gatilhos:** `push` (qualquer branch) e `workflow_dispatch` (execução manual).
- **Runner:** `ubuntu-latest`.
- **Etapas:** checkout, instalação de dependências e execução da suíte via `cypress-io/github-action@v6`.
- **Gate de qualidade:** falha em qualquer teste reprova o job.

---

## Padrões adotados

- **Seletores resilientes:** priorizar atributos `data-test` / `data-cy`. Evitar seletores acoplados a CSS ou estrutura de DOM.
- **Testes independentes:** cada `it` deve rodar isolado, sem depender de ordem ou de estado de outro teste.
- **Setup em `beforeEach`:** pré-condições repetidas ficam centralizadas (hoje, o login).
- **Asserções explícitas:** todo teste termina validando o resultado esperado, nunca apenas executando ações.

---

## Débitos técnicos conhecidos

Registrados de forma transparente para priorização:

1. **`node_modules/` versionado no Git.** Falta um `.gitignore`. Isso infla o repositório e polui o histórico; deve ser removido do índice (`git rm -r --cached node_modules`).
2. **Credenciais hard-coded na spec.** Usuário e senha devem ir para variáveis de ambiente (`Cypress.env` / GitHub Secrets) ou para um custom command `cy.login()`.
3. **URL fixa na spec.** Mover para `baseUrl` em `cypress.config.js` e usar `cy.visit('/')`.
4. **Login via UI em todo teste.** Substituir por `cy.session()` para reduzir tempo de execução e flakiness.
5. **Script `npm test` placeholder.** Deve apontar para `cypress run`.
6. **Sem artefatos no CI.** Screenshots e vídeos de falha não são publicados.
7. **Pipeline roda em todo push, sem cache de dependências.** Considerar `cache` do npm e restringir gatilhos (PR + `main`).
8. **Nome da spec (`tst.cy.js`) pouco descritivo.** Adotar convenção por feature, por exemplo `cart.cy.js`.

---

## Roadmap

- [ ] Definir o SUT oficial (painel de controle IoT) e migrar `baseUrl`
- [ ] Criar `cy.login()` com `cy.session()`
- [ ] Adotar Page Object ou camada de abstração de seletores
- [ ] Ampliar cobertura: login (positivo e negativo), remoção do carrinho, checkout, ordenação e filtros
- [ ] Cenários negativos e de borda (credenciais inválidas, usuário bloqueado, carrinho vazio)
- [ ] Testes de API com `cy.request()` para validar contratos e acelerar o setup
- [ ] Upload de screenshots/vídeos como artefatos do workflow
- [ ] Relatório consolidado (Mochawesome ou Cypress Cloud)
- [ ] Execução paralela e matriz de navegadores
- [ ] Adicionar linter (ESLint + `eslint-plugin-cypress`)

---

## Contribuindo

1. Crie uma branch a partir de `main`.
2. Escreva ou ajuste os testes seguindo os [padrões adotados](#padrões-adotados).
3. Rode a suíte localmente (`npx cypress run`) antes do push.
4. Abra um PR e aguarde o pipeline ficar verde.

---

## Autoria

**Larissa Oliveira**, QA

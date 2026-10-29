# Etec Sales Gomes

Site institucional responsivo com React, TypeScript, Vite, API Express e SQLite.

## Requisitos

- Node.js 20 ou superior e npm.
- Docker, opcional para executar a imagem de produção.

## Desenvolvimento local

```powershell
npm install
Copy-Item server\.env.example server\.env
```

Edite `server/.env` e substitua `ADMIN_PASSWORD` por uma senha exclusiva com pelo menos 12 caracteres e `SESSION_SECRET` por um valor aleatório com pelo menos 32 caracteres. Não use esses valores de exemplo em produção nem compartilhe o arquivo `.env`.

```powershell
npm run dev
```

O Vite disponibiliza o frontend em `http://localhost:5173` e encaminha `/api` para `http://localhost:3001`. A primeira inicialização cria `server\data\site.db` automaticamente. A área administrativa fica em `/admin`.

## API

- `GET /api/health`
- `GET /api/institution`
- `GET /api/courses` e `GET /api/courses/:slug`
- `GET /api/news` e `GET /api/news/:id`
- `POST /api/admin/login`, `GET /api/admin/session`, `POST /api/admin/logout`
- `GET|POST /api/admin/news`, `PUT|DELETE /api/admin/news/:id`

O catálogo e as matrizes são exemplos temporários; confirme a oferta e a grade oficial antes de publicar como informação institucional. Notícias não publicadas ficam disponíveis apenas no painel autenticado.

## Build e execução

```powershell
npm run build
npm test --workspace server
npm start
```

`npm start` executa a API e, após o build, também serve o frontend na mesma origem. Configure no ambiente do servidor `NODE_ENV=production`, `PORT`, `APP_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET` e `DATABASE_PATH`. O banco SQLite deve residir em armazenamento persistente; use HTTPS em produção para habilitar o cookie seguro.

## Docker

```powershell
docker build -t etec-sales-gomes .
docker run --rm -p 3001:3001 -v etec-data:/data `
  -e APP_ORIGIN=https://seu-dominio `
  -e ADMIN_USERNAME=admin `
  -e ADMIN_PASSWORD=SUBSTITUA_POR_SENHA_EXCLUSIVA `
  -e SESSION_SECRET=SUBSTITUA_POR_SEGREDO_ALEATORIO_COM_32_CARACTERES `
  etec-sales-gomes
```

Configure `APP_ORIGIN` para a origem pública exata, incluindo o protocolo e sem barra final. A imagem não inclui credenciais; configure segredos pelo gerenciador de variáveis da plataforma. A publicação em uma plataforma específica ainda depende da escolha do provedor, domínio, armazenamento persistente e credenciais de deploy.

## Roadmap

R-01 a R-06 estão implementados neste repositório. R-07 está preparado para build e execução em contêiner, mas a publicação permanece pendente de plataforma e credenciais. Veja `specs/2026-10-29-feature-estrutura-base-responsiva/validation.md` para verificações e pendências.

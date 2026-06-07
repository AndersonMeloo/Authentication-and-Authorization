# Authentication and Authorization

API REST construída com NestJS para autenticação, autorização por papéis e controle de acesso por permissões. O projeto usa Prisma para persistência, PostgreSQL como banco de dados e JWT para proteger as rotas.

## Sobre o projeto

Este repositório concentra o backend da aplicação. A ideia principal é centralizar o cadastro de usuários e a gestão de posts, garantindo que cada rota seja acessada apenas por quem tem permissão para isso.

O fluxo funciona assim:

1. O usuário é criado com um papel e, opcionalmente, permissões extras.
2. O login valida email e senha e retorna um token JWT.
3. As requisições autenticadas enviam o token no header `Authorization: Bearer <token>`.
4. Os guards verificam autenticação, papel e regras de acesso antes de liberar a operação.
5. O Prisma salva e consulta os dados no PostgreSQL.

## O que o sistema faz

- autenticação com JWT;
- controle de acesso com papéis `ADMIN`, `EDITOR`, `WRITER` e `READER`;
- permissões personalizadas por usuário armazenadas em JSON;
- cadastro, listagem, atualização e remoção de usuários;
- cadastro, listagem, atualização e remoção de posts;
- proteção de rotas com guards de autenticação e autorização;
- integração com Prisma e PostgreSQL.

## Tecnologias usadas

- NestJS
- Prisma
- PostgreSQL
- JWT
- bcrypt
- CASL
- TypeScript
- Docker

## Como o projeto está organizado

```text
src/
	auth/
		auth.controller.ts
		auth.service.ts
		auth.guard.ts
		role/
			role.guard.ts
	cals/
		cals-ability/
	posts/
		dto/
		entities/
	prisma/
	users/
		dto/
		entities/

prisma/
	schema.prisma
	migrations/

api.http
docker-compose.yaml
```

## Como rodar localmente

### 1. Subir o banco de dados

O repositório já traz um arquivo `docker-compose.yaml` com PostgreSQL.

```bash
docker compose up -d
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o Prisma

Com o banco disponível e a `DATABASE_URL` configurada, rode as migrations:

```bash
npx prisma migrate dev
```

Se precisar regenerar o client do Prisma:

```bash
npx prisma generate
```

### 4. Iniciar a aplicação

```bash
npm run start:dev
```

## Variáveis de ambiente

As variáveis principais usadas pelo projeto são:

- `DATABASE_URL` - string de conexão com o PostgreSQL;
- `PORT` - porta da aplicação. Se não for informada, o backend sobe em `3000`.

Exemplo de arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/mydb"
PORT=3000
```

## Fluxo de autenticação e autorização

- `POST /auth/login` autentica o usuário e retorna o token JWT;
- as rotas de `users` exigem autenticação e papel `ADMIN`;
- as rotas de `posts` exigem autenticação e validam as permissões do usuário;
- `ADMIN` pode gerenciar tudo;
- `EDITOR` pode criar, ler e atualizar posts;
- `WRITER` pode criar posts e acessar apenas os próprios posts permitidos pelas regras;
- `READER` pode ler posts publicados.

## Rotas principais da API

### Autenticação

- `POST /auth/login`

### Usuários

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Posts

- `POST /posts`
- `GET /posts`
- `GET /posts/:id`
- `PATCH /posts/:id`
- `DELETE /posts/:id`

## Como testar a API

O arquivo `api.http` na raiz do projeto já traz exemplos prontos de criação de usuários, login e uso dos tokens nas requisições.

Você pode usá-lo diretamente no VS Code para validar o fluxo completo da API.

## Observações importantes

- o login exige um usuário já cadastrado no banco;
- a senha é armazenada com hash usando bcrypt;
- o token JWT expira em 2 horas;
- as permissões extras podem ser salvas em JSON no cadastro do usuário;
- se o token estiver ausente, inválido ou expirado, a rota protegida retorna erro de autorização.

## Scripts disponíveis

- `npm run start:dev` - inicia o servidor em modo de desenvolvimento;
- `npm run build` - gera a build de produção;
- `npm run start:prod` - executa a aplicação compilada;
- `npm run test` - executa os testes;
- `npm run test:e2e` - executa os testes end-to-end;
- `npm run lint` - executa o lint;
- `npm run format` - formata os arquivos TypeScript.


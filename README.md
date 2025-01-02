# pet-api

> A simple API to manage pet adoptions. Built to learn more about clean restful API design, swagger, caching strategies, and more.

## Features

- CRUD operations for pets
- Pagination for pets
- Authentication with express-session and redis
- Unit tests with Jest
- Integration tests with Jest and supertest
- End-to-end tests with Playwright
- Health check endpoint
- Version endpoint
- Swagger documentation
- XML support for health and version endpoints
- Containerized with Docker

## tech stack

Server:

- [Node.js](https://nodejs.org/en/) - runtime environment
- [Express](https://expressjs.com/) - web framework
- [PostgreSQL](https://www.postgresql.org/) - persistence layer
- [Redis](https://redis.io/) - caching layer
- [Swagger](https://swagger.io/) - API documentation
- [Jest](https://jestjs.io) - Unit testing and integration testing
- [supertest](https://www.npmjs.com/package/supertest) - Integration testing
- [Playwright](https://playwright.dev/) - end-to-end testing
- [Docker](https://www.docker.com/) - Containerization and deployment
- [AWS](https://aws.amazon.com/) - Cloud provider (ECR, ECS, ELB, Route 53)
- [Terraform](https://www.terraform.io/) - Infrastructure as code

Frontend:

- [Next.js](https://nextjs.org/) - Frontend framework
- [React](https://reactjs.org/) - Frontend library
- [Cloudflare](https://www.cloudflare.com/) - CDN + deployment

## Environments

| Environment | API                                   | Frontend                            |
| ----------- | ------------------------------------- | ----------------------------------- |
| Production  | TBD                                   | TBD                                 |
| Staging     | https://pets-staging.lhowsam.com/docs | https://ui-pets-staging.lhowsam.com |

## Getting Started

**You will need to install the following in order to get this project up & running locally**

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [NVM](https://github.com/nvm-sh/nvm)
- [Docker](https://www.docker.com/)

**use correct package manager and npm versions**

Corepack is a tool installed as part of your Node.js installation that allows you to install and
manage multiple package manager versions in your environment based on per-project configuration
(via the `packageManager` field in `package.json`).

We use corepack to ensure that everyone is using the same version of PNPM to avoid any issues when
people are using different versions of PNPM.

```bash
corepack enable
nvm install
nvm use
```

If for some reason the above corepack command doesn't work, you can install PNPM manually by running:

```bash
PNPM_VERSION=$(node -e "console.log(require('./package.json').engines.pnpm)")
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=$PNPM_VERSION sh -
```

This will install the package manager version specified in the `package.json` file. You can check
that this has been installed by running:

```bash
pnpm -v
```

### Install dependencies

Install the project's PNPM dependencies by simply running:

```sh
pnpm i
```

### Running the server

cd into the api directory for the following commands

```sh
cd apps/api
```

### setup databases

```
docker-compose up
```

you will then need to generate the prisma client and run migrations to create the tables in your database

```sh
pnpm db:generate && pnpm db:migrate
```

### start the server

```sh
pnpm dev
```

You can validate that the server is running by visiting `http://localhost:8000/api/healthcheck` in your browser. If everything is setup ok, you should see a response with the following body:

```
{
  db: true,
  cache: true,
  status: "OK"
}
```

### Documentation

Documentation of all endpoints can be found by visiting `http://localhost:8000/docs`. We use `zod-to-openapi` to transform the validation schemas that the server uses into openAPI specs for swagger to present

### Running integration tests

```sh
pnpm t
```

This will setup the test database, run the integration & unit tests, and then finally reset the test database.

### Running end-to-end tests

First you'll need to install playwright browsers if you haven't already

```sh
make e2e-install-browsers
```

Run all tests

```sh
make e2e-local
```

Run one test

```sh
tests=test-name make e2e-local
```


# Resources needed

1. VS Code
2. Download PostgreSQL, pgAdmin4, and DBeaver
3. Download Node.js v18.14.2 (the project is currently using this version)
 
# How to run source code

1. Clone the source code from GitHub
   > Repository URL: https://github.com/HdThinh6102git/Oron-service
   > If you have already cloned the repository, make sure to run "git pull" each time you want to get the latest code.
2. Open the project in VS Code.
3. Open the terminal and run "npm i" to install dependencies.
4. Copy the ".env.dev" file and create a new file named ".env".
5. In pgAdmin, create a new database with the specified database name, password, user, and port (matching the configuration in the ".env" file).
6. Run "npm run start:dev" in the terminal.
7. Run the command "npm run migrate:up" to apply migrations to the database. Then, check if the tables have been created in the database.
8. Use the API to import address data by calling the "import address" endpoint.
9. Use DBeaver or pgAdmin to add data to the "Role" table with the name "USER".
10. Run tests on the APIs.

# Service

Node.js framework NestJS project structure

## Configuration

1. Create a `.env` file
    - Rename the [.env.dev](.env.dev) file to `.env` to fix it.
2. Edit env config
    - Edit the file in the [config](src/config) folder.
    - `default`, `development`, `production`

## Installation

```sh
# 1-1. npm < v7 or Node.js <= v18.14.0
npm i

## Development

```sh
npm run start:dev
# https://docs.nestjs.com/recipes/repl
npm run start:repl
```

Run [http://localhost:3500](http://localhost:3500)
## Folders

```js
+-- bin // Custom tasks
+-- dist // Source build
+-- public // Static Files
+-- src
|   +-- config // Environment Configuration
|   +-- entity // TypeORM Entities
|   +-- auth // Authentication
|   +-- common // Global Nest Module
|   |   +-- constants // Constant value and Enum
|   |   +-- controllers // Nest Controllers
|   |   +-- decorators // Nest Decorators
|   |   +-- dto // DTO (Data Transfer Object) Schema, Validation
|   |   +-- filters // Nest Filters
|   |   +-- guards // Nest Guards
|   |   +-- interceptors // Nest Interceptors
|   |   +-- interfaces // TypeScript Interfaces
|   |   +-- middleware // Nest Middleware
|   |   +-- pipes // Nest Pipes
|   |   +-- providers // Nest Providers
|   |   +-- * // models, repositories, services...
|   +-- shared // Shared Nest Modules
|   +-- gql // GraphQL Structure
|   +-- * // Other Nest Modules, non-global, same as common structure above
+-- test // Jest testing
+-- typings // Modules and global type definitions

// Module structure
// Add folders according to module scale. If it's small, you don't need to add folders.
+-- src/greeter
|   +-- * // folders
|   +-- greeter.constant.ts
|   +-- greeter.controller.ts
|   +-- greeter.service.ts
|   +-- greeter.module.ts
|   +-- greeter.*.ts
|   +-- index.ts
```

## Implements

- See [bootstrap](src/app.ts), [app.module](src/app.module.ts)
    - Database, Module Router, Static Files, Validation, Pino Logger
- [Global Exception Filter](src/common/filters/exceptions.filter.ts)
- [Global Logging Context Middleware](src/common/middleware/logger-context.middleware.ts)
- [Custom Logger](src/config/logger.config.ts) with nestjs-pino
- [Custom Decorators](src/debug) Example at Nest level
- [Configuration](src/config)
- [Authentication](src/auth) - JWT and Session login with Passport
- [Role-based Guard](src/common/guards/roles.guard.ts)
- Controller Routes
    - [Auth Login](src/base/controllers/auth.controller.ts)
    - [Sample](src/sample/controllers/sample.controller.ts) Parameter and [DTO](src/sample/dto/sample.dto.ts)
    - [CRUD API](src/sample/controllers/crud.controller.ts) Sample
- [Database Query](src/sample/providers/database.service.ts) Example
- [Unit Test](src/sample/providers/crud.service.spec.ts)
- [E2E Test](test/e2e)
- [Shared Modules](src/shared) Example
- [GraphQL Structure](src/gql) Example

## Documentation

```sh
# APP, Compodoc
npm run doc #> http://localhost:8080
# API, Swagger - src/swagger.ts
npm run doc:api #> http://localhost:8000/api
```

### File Naming for Class

```ts
export class PascalCaseSuffix {} //= pascal-case.suffix.ts
// Except for suffix, PascalCase to hyphen-case
class FooBarNaming {} //= foo-bar.naming.ts
class FooController {} //= foo.controller.ts
class BarQueryDto {} //= bar-query.dto.ts
```

### Links

- [Better Nodejs Project](https://github.com/CatsMiaow/better-nodejs-project)
- [Nest Sample](https://github.com/nestjs/nest/tree/master/sample)
- [Awesome Nest](https://github.com/juliandavidmr/awesome-nestjs)
- [NestJS](https://docs.nestjs.com)
- [TypeORM](https://typeorm.io)

### git commit rule
> type(scope?): subject
>
```angular2html
type ở trên có thể là:
    - build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    - ci: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
    - chore: add something without touching production code (Eg: update npm dependencies)
    - docs: Documentation only changes
    - feat: A new feature
    - fix: A bug fix
    - perf: A code change that improves performance
    - refactor: A code change that neither fixes a bug nor adds a feature
    - revert: Reverts a previous commit
    - style: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons, etc)
    - test: Adding missing tests or correcting existing tests
```
migrate generate (auto generate all changes (foreign drop table)): npm run migrate:generate
migrate up (up all migrate files to the database): npm run migrate:up
migrate down (rollback file latest database): npm run migrate:down
```

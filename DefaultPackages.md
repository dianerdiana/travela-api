# Basic Configuration

<p>Ini adalah packages yang dibutuhkan untuk konfigurasi awal dan step by step-nya</p>

## Prisma ORM

```bash
$ npm install prisma --save-dev
$ npm install @prisma/client
```

### Inisialisasi prisma:

```bash
$ npx prisma init --datasource-provider mysql
```

### Migrasi schema prisma

```bash
$ npx prisma migrate dev
```

## Logger (Winston)

```bash
$ npm install winston nest-winston
```

## Validation (Zod)

```bash
$ npm install zod
```

## Passport JWT

```bash
$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt
```

## Configuring Cors

```bash
$ npm install @nestjs/platform-express
```

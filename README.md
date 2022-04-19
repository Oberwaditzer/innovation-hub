# Innovation Hub

## Initialization

Start docker containers

```shell
docker-compose up -d
```

Install dependencies

```shell
yarn
```

Initialize database structure

```shell
yarn prisma migrate dev
```

Generate prisma client and type-graphql classes

```shell
yarn prisma generate
```

Clear database

```shell
yarn clear-database
```

Load seed data

```shell
yarn seed-database
```

Start server

```shell
yarn dev
```

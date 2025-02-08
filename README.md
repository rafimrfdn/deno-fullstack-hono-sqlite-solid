This project is a clone of [deno+solid](https://github.com/denoland/examples/tree/main/with-solidjs) with integration of Sqlite database to run CRUD function.

## Tech stack
- Deno
- Hono
- Sqlite
- Vite
- Solid JS

## Usage

### run seed data

first lets create a sqlite database file by seeding all dinosaurs data from data.json file.

```sh
$ cd api

$ deno run -A api/seed.ts
```

so now we have a **dinosaurs.db** file.

### run dev

```sh
$ deno task dev
```

### run build

```sh
$ deno task build
```

### run serve

```sh
$ deno task dev:api

$ deno task preview
```

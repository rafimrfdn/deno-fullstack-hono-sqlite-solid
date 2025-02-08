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

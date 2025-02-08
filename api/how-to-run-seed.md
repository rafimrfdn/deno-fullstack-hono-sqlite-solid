> make sure to have the data.json file is the same file with the seed.ts file.

seed file is just a script to produce a sqlite database file. 

if you go to this directory then run seed file then you can get the database on the same directory with the seed.ts file


```sh
$ cd api

$ deno run -A seed.ts
```

but I have said on the readme file that we can run the seed directly from the main project

```sh
$ deno run -A api/seed.ts
```

so now we have just produce the `dinosaurs.db` file on the main project directory, not in the api directory.

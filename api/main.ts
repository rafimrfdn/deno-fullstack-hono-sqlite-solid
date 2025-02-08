import { Hono } from "@hono/hono";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const app = new Hono();
const db = new DB("dinosaurs.db");

// Create table if it doesn’t exist
db.query(`
  CREATE TABLE IF NOT EXISTS dinosaurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    description TEXT
  )
`);

// CRUD functions
const crusld = {
  create: (name: string, description: string) => {
    db.query("INSERT INTO dinosaurs (name, description) VALUES (?, ?)", [name, description]);
  },
  read: () => {
    return db.query("SELECT id, name, description FROM dinosaurs").map(([id, name, description]) => ({
      id,
      name,
      description,
    }));
  },
  update: (id: number, name: string, description: string) => {
    db.query("UPDATE dinosaurs SET name = ?, description = ? WHERE id = ?", [name, description, id]);
  },
  delete: (id: number) => {
    db.query("DELETE FROM dinosaurs WHERE id = ?", [id]);
  },
};

// Routes
app.get("/", (c) => c.text("Welcome to the Dinosaur API!"));

// Get all dinosaurs
//app.get("/api/dinosaurs", (c) => {
//  const dinosaurs = crusld.read();
//  return c.json(dinosaurs);
//});
//
app.get("/api/dinosaurs", (c) => {
  const dinosaurs = crusld.read();

  if (dinosaurs.length === 0) {
    return c.json([]); // Return an empty array instead of nothing
  }

  return c.json(dinosaurs);
});

// Get a single dinosaur by name
app.get("/api/dinosaurs/:name", (c) => {
  const name = c.req.param("name");
  if (!name) return c.text("No dinosaur name provided.");

  const dinosaur = db.query("SELECT id, name, description FROM dinosaurs WHERE LOWER(name) = LOWER(?)", [name])
    .map(([id, name, description]) => ({ id, name, description }));

  return dinosaur.length ? c.json(dinosaur[0]) : c.notFound();
});

// Add a new dinosaur
app.post("/api/dinosaurs", async (c) => {
  const { name, description } = await c.req.json();
  crusld.create(name, description);
  return c.text("Dinosaur added!");
});

// Update an existing dinosaur
app.put("/api/dinosaurs/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { name, description } = await c.req.json();
  crusld.update(id, name, description);
  return c.text("Dinosaur updated!");
});

// Delete a dinosaur
app.delete("/api/dinosaurs/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  crusld.delete(id);
  return c.text("Dinosaur deleted!");
});

//Deno.serve(app.fetch);
Deno.serve({ port: 8000 }, app.fetch);

import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Open SQLite database
const db = new DB("dinosaurs.db");

// Create the table if it doesn’t exist
db.query(`
  CREATE TABLE IF NOT EXISTS dinosaurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    description TEXT
  )
`);

//// JSON data to seed
//const dinosaurs = [
//  { name: "Aardonyx", description: "An early stage in the evolution of sauropods." },
//  { name: "Abelisaurus", description: "\"Abel's lizard\" has been reconstructed from a single skull." },
//  { name: "Abrictosaurus", description: "An early relative of Heterodontosaurus." }
//];

// Read JSON data from file, execute by run `deno run -A api/seed.ts`
const jsonFile = "./api/data.json"; // Adjust the path if needed

try {
  const data = await Deno.readTextFile(jsonFile);
  const dinosaurs = JSON.parse(data);

  if (!Array.isArray(dinosaurs)) {
    throw new Error("Invalid JSON format: Expected an array");
  }

  // Start a transaction
  db.query("BEGIN TRANSACTION");

  for (const dino of dinosaurs) {
    try {
      db.query("INSERT INTO dinosaurs (name, description) VALUES (?, ?)", [
        dino.name,
        dino.description,
      ]);
      console.log(`✅ Inserted: ${dino.name}`);
    } catch (error) {
      console.error(`❌ Error inserting ${dino.name}:`, error.message);
    }
  }

  // Commit the transaction
  db.query("COMMIT");

  console.log("✅ Seeding complete!");
} catch (error) {
  console.error("❌ Error reading JSON file:", error.message);
}

// Close the database connection
db.close();

// src/pages/Index.tsx
import { createSignal, onMount, For } from "solid-js";
import { A } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = createSignal<Dino[]>([]);
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [editId, setEditId] = createSignal<number | null>(null);

  // Fetch dinosaurs on mount
  onMount(fetchDinosaurs);

  async function fetchDinosaurs() {
    try {
      const response = await fetch("/api/dinosaurs");
      const allDinosaurs = (await response.json()) as Dino[];
      setDinosaurs(allDinosaurs);
    } catch (error) {
      console.error("Failed to fetch dinosaurs:", error);
    }
  }

  async function addDinosaur() {
    try {
      await fetch("/api/dinosaurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name(), description: description() }),
      });
      setName("");
      setDescription("");
      fetchDinosaurs(); // Refresh list
    } catch (error) {
      console.error("Error adding dinosaur:", error);
    }
  }

  async function updateDinosaur() {
    if (editId() === null) return;
    try {
      await fetch(`/api/dinosaurs/${editId()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name(), description: description() }),
      });
      setEditId(null);
      setName("");
      setDescription("");
      fetchDinosaurs(); // Refresh list
    } catch (error) {
      console.error("Error updating dinosaur:", error);
    }
  }

  async function deleteDinosaur(id: number) {
    try {
      await fetch(`/api/dinosaurs/${id}`, { method: "DELETE" });
      fetchDinosaurs(); // Refresh list
    } catch (error) {
      console.error("Error deleting dinosaur:", error);
    }
  }

  function startEdit(dino: Dino) {
    setEditId(dino.id);
    setName(dino.name);
    setDescription(dino.description);
  }

  return (
    <main>
      <h1>Welcome to the Dinosaur App</h1>
      <p>Click on a dinosaur below to learn more.</p>

      {/* Form for adding/updating dinosaurs */}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
        {editId() === null ? (
          <button onClick={addDinosaur}>Add Dinosaur</button>
        ) : (
          <button onClick={updateDinosaur}>Update Dinosaur</button>
        )}
      </div>

      {/* List of dinosaurs */}
      <ul>
        <For each={dinosaurs()}>
          {(dinosaur) => (
            <li class="dinosaur">
              <A href={`/${dinosaur.name.toLowerCase()}`}  >
                {dinosaur.name}
              </A>
              <div>
                <button onClick={() => startEdit(dinosaur)}>Edit</button>
                <button onClick={() => deleteDinosaur(dinosaur.id)}>Delete</button>
              </div>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}

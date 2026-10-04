import { useEffect, useState } from "react";
import "./App.css";

// Relative URL: works locally (Vite proxy) and on Azure (same server)
const API = "/api/users";
const emptyForm = { name: "", email: "", age: "" };

export default function App() {
  const [users, setUsers] = useState([]);       // list of users from the database
  const [form, setForm] = useState(emptyForm);  // form fields
  const [editingId, setEditingId] = useState(null); // id of the user being edited
  const [error, setError] = useState("");

  // GET: load all users
  async function loadUsers() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Could not load users (is the database connected?)");
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  // Load users once when the page opens
  useEffect(() => {
    loadUsers();
  }, []);

  // Update the form state when the person types
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // POST (new user) or PUT (edit user) when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const body = {
      name: form.name,
      email: form.email,
      age: form.age === "" ? undefined : Number(form.age),
    };
    try {
      const res = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForm(emptyForm);
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  // Put a user's data in the form to edit it
  function startEdit(user) {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email, age: user.age ?? "" });
  }

  // DELETE: remove a user
  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the user");
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>MERN Users</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" className="grey" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <span>
              <strong>{user.name}</strong> - {user.email} {user.age ? `(${user.age})` : ""}
            </span>
            <span>
              <button onClick={() => startEdit(user)}>Edit</button>
              <button className="red" onClick={() => handleDelete(user._id)}>Delete</button>
            </span>
          </li>
        ))}
        {users.length === 0 && <li>No users yet.</li>}
      </ul>
    </div>
  );
}

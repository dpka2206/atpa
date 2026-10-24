"use client";

import { FormEvent, useEffect, useState } from "react";
import { ADMIN_ROLES } from "@/lib/constants";

type AdminUser = {
  _id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
};

export function UsersPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to load users");
      return;
    }
    setUsers(data.users || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Create failed");
      return;
    }
    setMessage("User created");
    e.currentTarget.reset();
    await load();
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-leaf">{message}</p> : null}

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-xl border border-ink/8 bg-white p-5 md:grid-cols-2"
      >
        <h2 className="font-display text-lg md:col-span-2">Add admin user</h2>
        <input
          name="name"
          required
          placeholder="Name"
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <select
          name="role"
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
          defaultValue="association_admin"
        >
          {ADMIN_ROLES.map((role) => (
            <option key={role} value={role}>
              {role.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white md:col-span-2 md:w-fit"
        >
          Create user
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/8 bg-canvas/50 text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-3 py-2 font-medium">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.role.replaceAll("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSite } from "@/lib/actions/sites";

export default function NewSite() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createSite({
      name,
      domain,
      teamId: 1, // Replace with actual team ID
    });
    router.push("/dashboard/sites");
  }

  return (
    <div>
      <h1>Create New Site</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Site Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="domain">Domain</label>
          <input
            id="domain"
            name="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Site</button>
      </form>
    </div>
  );
}

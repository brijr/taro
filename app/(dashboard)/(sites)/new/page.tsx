"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSite } from "@/lib/actions/sites";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    router.push("/sites");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Site</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Site Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-gray-700"
          >
            Domain
          </label>
          <Input
            id="domain"
            name="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full">
          Create Site
        </Button>
      </form>
    </div>
  );
}

"use client";

import { createSite } from "@/lib/actions/sites";
import { useRouter } from "next/navigation";

export default function NewSite({ teamId }: { teamId: number }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const domain = formData.get("domain") as string;

    await createSite({
      teamId,
      name,
      domain,
      isActive: true,
    });

    router.push(`/teams/${teamId}/sites`);
  }

  return (
    <form action={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <input
        name="name"
        placeholder="Site Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="domain"
        placeholder="Domain"
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Site
      </button>
    </form>
  );
}

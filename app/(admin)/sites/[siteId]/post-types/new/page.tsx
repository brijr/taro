"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPostType } from "@/lib/actions/post-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewPostType({
  params,
}: {
  params: { siteId: string };
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("params.siteId:", params.siteId); // Add logging
    const siteId = parseInt(params.siteId, 10);
    if (isNaN(siteId)) {
      console.error("Invalid siteId:", params.siteId);
      return;
    }
    await createPostType({
      siteId,
      name,
      slug,
      description,
      fields: [],
      isActive: true,
    });
    router.push(`/${params.siteId}/post-types`);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Post Type</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Post Type Name
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
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <Input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Input
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full">
          Create Post Type
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFields, createField, deleteField } from "@/lib/actions/fields";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/lib/db/schema";

export default function Fields({
  params,
}: {
  params: { siteId: string; postTypeId: string };
}) {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    async function fetchFields() {
      const postTypeId = parseInt(params.postTypeId, 10);
      if (isNaN(postTypeId)) {
        console.error("Invalid postTypeId:", params.postTypeId);
        return;
      }
      const fields = await getFields(postTypeId);
      setFields(fields);
    }

    fetchFields();
  }, [params.postTypeId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const postTypeId = parseInt(params.postTypeId, 10);
    if (isNaN(postTypeId)) {
      console.error("Invalid postTypeId:", params.postTypeId);
      return;
    }
    await createField({
      postTypeId,
      name,
      slug,
      type,
      isRequired,
      order: fields.length,
      defaultValue: null,
      options: null,
    });
    setName("");
    setSlug("");
    setType("");
    setIsRequired(false);
    const updatedFields = await getFields(postTypeId);
    setFields(updatedFields);
  }

  async function handleDelete(fieldId: number) {
    await deleteField(fieldId);
    const postTypeId = parseInt(params.postTypeId, 10);
    const updatedFields = await getFields(postTypeId);
    setFields(updatedFields);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Fields</h1>
      <ul className="mb-6">
        {fields.map((field) => (
          <li key={field.id} className="mb-2">
            <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{field.name}</h2>
                <p className="text-sm text-gray-600">{field.type}</p>
              </div>
              <Button onClick={() => handleDelete(field.id)} className="ml-4">
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Field Name
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
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <Input
            id="type"
            name="type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="isRequired"
            className="block text-sm font-medium text-gray-700"
          >
            Is Required
          </label>
          <input
            id="isRequired"
            name="isRequired"
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full">
          Add Field
        </Button>
      </form>
    </div>
  );
}

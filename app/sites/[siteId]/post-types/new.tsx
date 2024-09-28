"use client";

import { createPostType } from "@/lib/actions/post-types";
import { createField } from "@/lib/actions/fields";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPostType({
  params,
}: {
  params: { siteId: string };
}) {
  const router = useRouter();
  const siteId = parseInt(params.siteId);
  const [fields, setFields] = useState<
    Array<{ name: string; type: string; isRequired: boolean }>
  >([]);

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    const newPostType = await createPostType({
      siteId,
      name,
      slug,
      description,
      fields: [],
      isActive: true,
    });

    // Create fields
    for (const field of fields) {
      await createField({
        postTypeId: newPostType.id,
        name: field.name,
        slug: field.name.toLowerCase().replace(/\s+/g, "-"),
        type: field.type,
        isRequired: field.isRequired,
        order: fields.indexOf(field),
      });
    }

    router.push(`/sites/${siteId}/post-types`);
  }

  function addField() {
    setFields([...fields, { name: "", type: "text", isRequired: false }]);
  }

  function updateField(
    index: number,
    updates: Partial<(typeof fields)[number]>
  ) {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  }

  return (
    <form action={handleSubmit} className="p-4 space-y-4">
      <input
        name="name"
        placeholder="Post Type Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="slug"
        placeholder="Slug"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full p-2 border rounded"
      ></textarea>

      <h3 className="text-lg font-semibold">Fields</h3>
      {fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <input
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
            placeholder="Field Name"
            required
            className="w-full p-2 border rounded"
          />
          <select
            value={field.type}
            onChange={(e) => updateField(index, { type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
          </select>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.isRequired}
              onChange={(e) =>
                updateField(index, { isRequired: e.target.checked })
              }
              className="mr-2"
            />
            Required
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={addField}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Field
      </button>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Post Type
      </button>
    </form>
  );
}

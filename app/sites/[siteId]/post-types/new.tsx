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
    <form action={handleSubmit}>
      <input name="name" placeholder="Post Type Name" required />
      <input name="slug" placeholder="Slug" required />
      <textarea name="description" placeholder="Description"></textarea>

      <h3>Fields</h3>
      {fields.map((field, index) => (
        <div key={index}>
          <input
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
            placeholder="Field Name"
            required
          />
          <select
            value={field.type}
            onChange={(e) => updateField(index, { type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={field.isRequired}
              onChange={(e) =>
                updateField(index, { isRequired: e.target.checked })
              }
            />
            Required
          </label>
        </div>
      ))}
      <button type="button" onClick={addField}>
        Add Field
      </button>

      <button type="submit">Create Post Type</button>
    </form>
  );
}

"use client";

import { createPost } from "@/lib/actions/posts";
import { getPostType } from "@/lib/actions/post-types";
import { getFields } from "@/lib/actions/fields";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PostType, Field } from "@/lib/db/schema";

export default function NewPost({
  params,
}: {
  params: { siteId: string; postTypeId: string };
}) {
  const router = useRouter();
  const [postType, setPostType] = useState<PostType | null>(null);
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedPostType = await getPostType(parseInt(params.postTypeId));
      const fetchedFields = await getFields(parseInt(params.postTypeId));
      setPostType(fetchedPostType);
      setFields(fetchedFields);
    }
    fetchData();
  }, [params.postTypeId]);

  async function handleSubmit(formData: FormData) {
    if (!postType) return;

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content: Record<string, unknown> = {};

    fields.forEach((field) => {
      content[field.slug] = formData.get(field.slug);
    });

    await createPost({
      postTypeId: postType.id,
      authorId: 1, // You'll need to get the actual author ID
      title,
      slug,
      content,
      status: "draft",
      isPublished: false,
    });

    router.push(
      `/sites/${params.siteId}/post-types/${params.postTypeId}/posts`
    );
  }

  if (!postType) {
    return <div>Loading...</div>;
  }

  return (
    <form action={handleSubmit}>
      <h1>New {postType.name}</h1>
      <input name="title" placeholder="Title" required />
      <input name="slug" placeholder="Slug" required />

      {fields.map((field) => (
        <div key={field.id}>
          <label>{field.name}</label>
          {field.type === "text" && <input name={field.slug} type="text" />}
          {field.type === "number" && <input name={field.slug} type="number" />}
          {field.type === "boolean" && (
            <input name={field.slug} type="checkbox" />
          )}
          {field.type === "date" && <input name={field.slug} type="date" />}
        </div>
      ))}

      <button type="submit">Create Post</button>
    </form>
  );
}

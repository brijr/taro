"use client";

import { createPost } from "@/lib/actions/posts";
import { useRouter } from "next/navigation";

export default function NewPost({ postTypeId }: { postTypeId: number }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = JSON.parse(formData.get("content") as string);

    await createPost({
      postTypeId,
      authorId: 1, // You'll need to get the actual author ID
      title,
      slug,
      content,
      status: "draft",
      isPublished: false,
    });

    router.push(`/sites/${postTypeId}/posts`);
  }

  return (
    <div className="p-4">
      <form action={handleSubmit} className="space-y-4">
        {/* Form fields here */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

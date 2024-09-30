"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostTypes, deletePostType } from "@/lib/actions/post-types";
import { Button } from "@/components/ui/button";
import { PostType } from "@/lib/db/schema";

export default function PostTypes({ params }: { params: { siteId: string } }) {
  const router = useRouter();
  const [postTypes, setPostTypes] = useState<PostType[]>([]);

  useEffect(() => {
    async function fetchPostTypes() {
      const siteId = parseInt(params.siteId, 10);
      if (isNaN(siteId)) {
        console.error("Invalid siteId:", params.siteId);
        return;
      }
      const postTypes = await getPostTypes(siteId);
      setPostTypes(postTypes);
    }

    fetchPostTypes();
  }, [params.siteId]);

  async function handleDelete(postTypeId: number) {
    await deletePostType(postTypeId);
    const siteId = parseInt(params.siteId, 10);
    const updatedPostTypes = await getPostTypes(siteId);
    setPostTypes(updatedPostTypes);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Post Types</h1>
      <ul className="mb-6">
        {postTypes.map((postType) => (
          <li key={postType.id} className="mb-2">
            <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{postType.name}</h2>
                <p className="text-sm text-gray-600">{postType.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    router.push(
                      `/${params.siteId}/post-types/${postType.id}/fields`,
                    )
                  }
                  className="ml-4"
                >
                  Manage Fields
                </Button>
                <Button
                  onClick={() => handleDelete(postType.id)}
                  className="ml-4"
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => router.push(`/${params.siteId}/post-types/new`)}
        className="w-full"
      >
        Add New Post Type
      </Button>
    </div>
  );
}

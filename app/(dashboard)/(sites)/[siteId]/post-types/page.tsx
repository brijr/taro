"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostTypes, deletePostType } from "@/lib/actions/post-types";
import { Button } from "@/components/ui/button";
import { PostType } from "@/lib/db/schema";
import Link from "next/link";

export default async function PostTypesPage({ params }: { params: { siteId: string } }) {
  const siteId = parseInt(params.siteId, 10);
  const postTypes = await getPostTypes(siteId);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Post Types</h1>
      <div className="space-y-4">
        {postTypes.map((postType) => (
          <div key={postType.id} className="flex items-center justify-between border p-4 rounded">
            <span>{postType.name}</span>
            <Link href={`/sites/${siteId}/post-types/${postType.id}/edit`}>
              <Button>Edit</Button>
            </Link>
          </div>
        ))}
      </div>
      <Link href={`/sites/${siteId}/post-types/new`}>
        <Button className="mt-4">Create New Post Type</Button>
      </Link>
    </div>
  );
}

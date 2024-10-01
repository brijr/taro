"use client";

import { getPostTypes } from "@/lib/actions/post-types";
import { getSite } from "@/lib/actions/sites";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PostTypesPage({
  params,
}: {
  params: { siteId: string };
}) {
  const siteId = parseInt(params.siteId, 10);
  const site = await getSite(siteId);
  const postTypes = await getPostTypes(siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Post Types for {site.name}</h1>
      <div className="space-y-4">
        {postTypes.map((postType) => (
          <div
            key={postType.id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <span>{postType.name}</span>
            <div>
              <Link href={`/sites/${siteId}/post-types/${postType.id}/edit`}>
                <Button variant="outline" className="mr-2">
                  Edit
                </Button>
              </Link>
              <Link
                href={`/sites/${siteId}/posts/new?postTypeId=${postType.id}`}
              >
                <Button>Create Post</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Link href={`/sites/${siteId}/post-types/new`}>
        <Button className="mt-4">Create New Post Type</Button>
      </Link>
    </div>
  );
}

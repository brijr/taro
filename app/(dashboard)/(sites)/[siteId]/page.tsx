"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostTypes, deletePostType } from "@/lib/actions/post-types";
import { Button } from "@/components/ui/button";
import { PostType } from "@/lib/db/schema";
import { getSite } from "@/lib/actions/sites";
import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const siteId = parseInt(params.siteId, 10);
  const site = await getSite(siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{site.name}</h1>
      <h2 className="text-xl font-semibold mt-8 mb-4">Media Management</h2>
      <MediaUpload siteId={siteId} />
      <h3 className="text-lg font-semibold mt-8 mb-4">Media Gallery</h3>
      <MediaGallery siteId={siteId} />
    </div>
  );
}

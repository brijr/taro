"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostTypes, deletePostType } from "@/lib/actions/post-types";
import { Button } from "@/components/ui/button";
import { PostType } from "@/lib/db/schema";
import { getSite } from "@/lib/actions/sites";
import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";
import { duplicateSite } from "@/lib/actions/sites";
import { toast } from "sonner";

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const siteId = parseInt(params.siteId, 10);
  const site = await getSite(siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  const handleDuplicate = async () => {
    "use server";
    try {
      const newSite = await duplicateSite(siteId);
      toast.success(`Site duplicated: ${newSite.name}`);
      // You might want to redirect to the new site here
      // revalidatePath('/sites');
    } catch (error) {
      console.error("Error duplicating site:", error);
      toast.error("Failed to duplicate site");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <form action={handleDuplicate}>
          <Button type="submit">Duplicate Site</Button>
        </form>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-4">Media Management</h2>
      <MediaUpload siteId={siteId} />
      <h3 className="text-lg font-semibold mt-8 mb-4">Media Gallery</h3>
      <MediaGallery siteId={siteId} />
    </div>
  );
}

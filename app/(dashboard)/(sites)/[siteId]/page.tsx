"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSite } from "@/lib/actions/sites";
import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";
import { handleDuplicate } from "../actions";
import { toast } from "sonner";

export default function SitePage({ params }: { params: { siteId: string } }) {
  const [site, setSite] = useState<any>(null);
  const siteId = parseInt(params.siteId, 10);

  useEffect(() => {
    async function fetchSite() {
      const fetchedSite = await getSite(siteId);
      setSite(fetchedSite);
    }
    fetchSite();
  }, [siteId]);

  if (!site) {
    return <div>Loading...</div>;
  }

  const onDuplicate = async () => {
    const result = await handleDuplicate(siteId);
    if (result.success) {
      toast.success(`Site duplicated: ${result.name}`);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <Button onClick={onDuplicate}>Duplicate Site</Button>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-4">Media Management</h2>
      <MediaUpload siteId={siteId} />
      <h3 className="text-lg font-semibold mt-8 mb-4">Media Gallery</h3>
      <MediaGallery siteId={siteId} />
    </div>
  );
}

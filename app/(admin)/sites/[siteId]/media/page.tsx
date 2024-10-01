import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";
import { getSite } from "@/lib/actions/sites";

export default async function SiteMediaPage({
  params,
}: {
  params: { siteId: string };
}) {
  const siteId = parseInt(params.siteId, 10);
  const site = await getSite(siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Media Library: {site.name}</h1>

      <h2 className="text-xl font-semibold mt-8 mb-4">Upload New Media</h2>
      <MediaUpload siteId={siteId} />

      <h2 className="text-xl font-semibold mt-8 mb-4">Media Gallery</h2>
      <MediaGallery siteId={siteId} />
    </div>
  );
}

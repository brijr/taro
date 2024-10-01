import { getSites } from "@/lib/actions/sites";
import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";
import { SiteDuplicateButton } from "@/components/SiteDuplicateButton";

export default async function SitePage({
  params,
}: {
  params: { siteId: string };
}) {
  const siteId = parseInt(params.siteId, 10);
  const sites = await getSites();
  const site = sites.find((s) => s.id === siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <SiteDuplicateButton siteId={siteId} />
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-4">Media Management</h2>
      <MediaUpload siteId={siteId} />
      <h3 className="text-lg font-semibold mt-8 mb-4">Media Gallery</h3>
      <MediaGallery siteId={siteId} />
    </div>
  );
}

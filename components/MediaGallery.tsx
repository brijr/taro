import { getMediaForSite } from "@/lib/actions/media";
import Image from "next/image";

export async function MediaGallery({ siteId }: { siteId: number }) {
  const media = await getMediaForSite(siteId);

  return (
    <div className="grid grid-cols-3 gap-4">
      {media.map((item) => (
        <div key={item.id} className="relative aspect-square">
          <Image
            src={item.url}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}

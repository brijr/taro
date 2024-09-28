import { getSiteWithPostTypes } from "@/lib/actions/sites";
import Link from "next/link";
import { Site, PostType } from "@/lib/db/schema";

export default async function SitePage({
  params,
}: {
  params: { siteId: string };
}) {
  const site = await getSiteWithPostTypes(parseInt(params.siteId));

  if (!site) {
    return <div className="text-center text-red-500">Site not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{site.name}</h1>
      <p className="mb-4">Domain: {site.domain}</p>
      <h2 className="text-xl font-semibold mb-2">Post Types:</h2>
      <Link
        href={`/sites/${site.id}/post-types/new`}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Create New Post Type
      </Link>
      <ul className="list-disc pl-5">
        {site.postTypes.map((postType: PostType) => (
          <li key={postType.id} className="mb-1">
            <Link
              href={`/sites/${site.id}/post-types/${postType.id}`}
              className="text-blue-500 hover:underline"
            >
              {postType.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

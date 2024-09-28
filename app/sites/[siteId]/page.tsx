import { getSiteWithPostTypes } from "@/lib/actions/sites";
import Link from "next/link";
import { Site, PostType } from '@/lib/db/schema';

export default async function SitePage({
  params,
}: {
  params: { siteId: string };
}) {
  const site = await getSiteWithPostTypes(parseInt(params.siteId));

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div>
      <h1>{site.name}</h1>
      <p>Domain: {site.domain}</p>
      <h2>Post Types:</h2>
      <Link href={`/sites/${site.id}/post-types/new`}>
        Create New Post Type
      </Link>
      <ul>
        {site.postTypes.map((postType: PostType) => (
          <li key={postType.id}>
            <Link href={`/sites/${site.id}/post-types/${postType.id}`}>
              {postType.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { getPostTypes } from "@/lib/actions/post-types";
import Link from "next/link";

export default async function PostTypesPage({
  params,
}: {
  params: { siteId: string };
}) {
  const postTypes = await getPostTypes(parseInt(params.siteId));

  return (
    <div>
      <h1>Post Types</h1>
      <Link href={`/sites/${params.siteId}/post-types/new`}>
        Create New Post Type
      </Link>
      <ul>
        {postTypes.map((postType) => (
          <li key={postType.id}>
            <Link href={`/sites/${params.siteId}/post-types/${postType.id}`}>
              {postType.name}
            </Link>
            {postType.isActive ? " (Active)" : " (Inactive)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

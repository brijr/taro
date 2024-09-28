import { getPostTypes } from "@/lib/actions/post-types";
import Link from "next/link";

export default async function PostTypesPage({
  params,
}: {
  params: { siteId: string };
}) {
  const postTypes = await getPostTypes(parseInt(params.siteId));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Post Types</h1>
      <Link
        href={`/sites/${params.siteId}/post-types/new`}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Create New Post Type
      </Link>
      <ul className="list-disc pl-5">
        {postTypes.map((postType) => (
          <li key={postType.id} className="mb-2">
            <Link
              href={`/sites/${params.siteId}/post-types/${postType.id}`}
              className="text-blue-500 hover:underline"
            >
              {postType.name}
            </Link>
            <span className="ml-2 text-sm">
              {postType.isActive ? "(Active)" : "(Inactive)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

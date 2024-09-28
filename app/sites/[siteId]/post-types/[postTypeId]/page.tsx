import { getPostTypeWithFields } from "@/lib/actions/post-types";
import { getPosts } from "@/lib/actions/posts";
import Link from "next/link";

export default async function PostTypePage({
  params,
}: {
  params: { siteId: string; postTypeId: string };
}) {
  const postType = await getPostTypeWithFields(parseInt(params.postTypeId));
  const posts = await getPosts(parseInt(params.postTypeId));

  if (!postType) {
    return <div className="text-red-500 text-center">Post Type not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{postType.name}</h1>
      <p className="mb-4">Slug: {postType.slug}</p>
      <h2 className="text-xl font-semibold mb-2">Fields:</h2>
      <ul className="list-disc pl-5 mb-4">
        {postType.fields.map((field) => (
          <li key={field.id} className="mb-1">
            {field.name} ({field.type})
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Posts:</h2>
      <Link
        href={`/sites/${params.siteId}/post-types/${postType.id}/posts/new`}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Create New Post
      </Link>
      <ul className="list-disc pl-5">
        {posts.map((post) => (
          <li key={post.id} className="mb-1">
            <Link
              href={`/sites/${params.siteId}/post-types/${postType.id}/posts/${post.id}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
            <span className="ml-2 text-sm">
              {post.isPublished ? "(Published)" : "(Draft)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

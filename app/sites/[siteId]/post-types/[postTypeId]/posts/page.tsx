import { getPosts } from "@/lib/actions/posts";
import { getPostType } from "@/lib/actions/post-types";
import Link from "next/link";

export default async function PostsPage({
  params,
}: {
  params: { siteId: string; postTypeId: string };
}) {
  const postType = await getPostType(parseInt(params.postTypeId));
  const posts = await getPosts(parseInt(params.postTypeId));

  if (!postType) {
    return <div className="text-red-500 text-center">Post Type not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{postType.name} Posts</h1>
      <Link
        href={`/sites/${params.siteId}/post-types/${params.postTypeId}/posts/new`}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Create New Post
      </Link>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center">
            <Link
              href={`/sites/${params.siteId}/post-types/${params.postTypeId}/posts/${post.id}`}
              className="text-blue-500 hover:underline mr-2"
            >
              {post.title}
            </Link>
            <span className="text-gray-600">
              - {post.status}
              {post.isPublished ? " (Published)" : " (Draft)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

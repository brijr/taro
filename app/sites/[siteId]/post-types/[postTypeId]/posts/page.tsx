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
    return <div>Post Type not found</div>;
  }

  return (
    <div>
      <h1>{postType.name} Posts</h1>
      <Link
        href={`/sites/${params.siteId}/post-types/${params.postTypeId}/posts/new`}
      >
        Create New Post
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/sites/${params.siteId}/post-types/${params.postTypeId}/posts/${post.id}`}
            >
              {post.title}
            </Link>
            - {post.status}
            {post.isPublished ? " (Published)" : " (Draft)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

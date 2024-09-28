import { getPostTypeWithFields } from '@/app/actions/post-types';
import { getPosts } from '@/app/actions/posts';
import Link from 'next/link';

export default async function PostTypePage({ params }: { params: { siteId: string, postTypeId: string } }) {
  const postType = await getPostTypeWithFields(parseInt(params.postTypeId));
  const posts = await getPosts(parseInt(params.postTypeId));

  if (!postType) {
    return <div>Post Type not found</div>;
  }

  return (
    <div>
      <h1>{postType.name}</h1>
      <p>Slug: {postType.slug}</p>
      <h2>Fields:</h2>
      <ul>
        {postType.fields.map((field) => (
          <li key={field.id}>{field.name} ({field.type})</li>
        ))}
      </ul>
      <h2>Posts:</h2>
      <Link href={`/sites/${params.siteId}/post-types/${postType.id}/posts/new`}>Create New Post</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/sites/${params.siteId}/post-types/${postType.id}/posts/${post.id}`}>
              {post.title}
            </Link>
            {post.isPublished ? ' (Published)' : ' (Draft)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

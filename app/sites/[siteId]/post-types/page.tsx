import { getPostTypes } from '@/app/actions/post-types';
import Link from 'next/link';

export default async function PostTypesPage({ params }: { params: { siteId: string } }) {
  const postTypes = await getPostTypes(parseInt(params.siteId));

  return (
    <div>
      <h1>Post Types</h1>
      <Link href={`/sites/${params.siteId}/post-types/new`}>Create New Post Type</Link>
      <ul>
        {postTypes.map((postType) => (
          <li key={postType.id}>
            {postType.name} - {postType.slug}
            {postType.isActive ? ' (Active)' : ' (Inactive)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { getSiteWithPostTypesAndFields } from '@/app/actions/sites';
import Link from 'next/link';

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const site = await getSiteWithPostTypesAndFields(parseInt(params.siteId));

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div>
      <h1>{site.name}</h1>
      <h2>Post Types:</h2>
      <ul>
        {site.postTypes.map((postType) => (
          <li key={postType.id}>
            <h3>{postType.name}</h3>
            <p>Fields:</p>
            <ul>
              {postType.fields.map((field) => (
                <li key={field.id}>{field.name} ({field.type})</li>
              ))}
            </ul>
            <Link href={`/sites/${site.id}/post-types/${postType.id}/posts`}>View Posts</Link>
          </li>
        ))}
      </ul>
      <Link href={`/sites/${site.id}/post-types/new`}>Create New Post Type</Link>
    </div>
  );
}

import { getPostTypes } from '@/app/actions/post-types';

export default async function PostTypes({ params }: { params: { siteId: string } }) {
  const postTypes = await getPostTypes(parseInt(params.siteId));

  return (
    <div>
      <h1>Post Types</h1>
      <ul>
        {postTypes.map((postType) => (
          <li key={postType.id}>{postType.name}</li>
        ))}
      </ul>
    </div>
  );
}

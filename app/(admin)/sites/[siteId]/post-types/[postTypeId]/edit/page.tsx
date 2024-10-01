import { getPostType } from "@/lib/actions/post-types";
import { PostTypeManager } from "@/components/PostTypeManager";

export default async function EditPostTypePage({ params }: { params: { postTypeId: string } }) {
  const postTypeId = parseInt(params.postTypeId, 10);
  const postType = await getPostType(postTypeId);

  if (!postType) {
    return <div>Post Type not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Edit Post Type: {postType.name}</h1>
      <PostTypeManager postType={postType} />
    </div>
  );
}

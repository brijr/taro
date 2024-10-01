import { getPostType } from "@/lib/actions/post-types";
import { createPost } from "@/lib/actions/posts";
import { DynamicForm } from "@/components/DynamicForm";
import { redirect } from "next/navigation";

export default async function NewPostPage({
  params,
}: {
  params: { siteId: string; postTypeId: string };
}) {
  const siteId = parseInt(params.siteId, 10);
  const postTypeId = parseInt(params.postTypeId, 10);
  const postType = await getPostType(postTypeId);

  if (!postType) {
    return <div>Post Type not found</div>;
  }

  const handleSubmit = async (formData: any) => {
    "use server";
    const newPost = await createPost({
      postTypeId,
      authorId: 1, // Replace with actual user ID
      title: formData.title,
      slug: formData.slug,
      content: formData,
      status: "draft",
    });

    redirect(`/sites/${siteId}/posts/${newPost.id}`);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Create New {postType.name}</h1>
      <DynamicForm
        fields={postType.fields}
        onSubmit={handleSubmit}
        siteId={siteId}
      />
    </div>
  );
}

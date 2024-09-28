'use client'

import { createPost } from '@/app/actions/posts';
import { useRouter } from 'next/navigation';

export default function NewPost({ postTypeId }: { postTypeId: number }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = JSON.parse(formData.get('content') as string);

    await createPost({
      postTypeId,
      authorId: 1, // You'll need to get the actual author ID
      title,
      slug,
      content,
      status: 'draft',
      isPublished: false,
    });

    router.push(`/sites/${postTypeId}/posts`);
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields here */}
      <button type="submit">Create Post</button>
    </form>
  );
}

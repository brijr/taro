'use client'

import { createPostType } from '@/app/actions/post-types';
import { useRouter } from 'next/navigation';

export default function NewPostType({ params }: { params: { siteId: string } }) {
  const router = useRouter();
  const siteId = parseInt(params.siteId);

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const fields = JSON.parse(formData.get('fields') as string);

    await createPostType({
      siteId,
      name,
      slug,
      description,
      fields,
      isActive: true,
    });

    router.push(`/sites/${siteId}/post-types`);
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Post Type Name" required />
      <input name="slug" placeholder="Slug" required />
      <textarea name="description" placeholder="Description"></textarea>
      <textarea name="fields" placeholder="Fields (JSON)" required></textarea>
      <button type="submit">Create Post Type</button>
    </form>
  );
}

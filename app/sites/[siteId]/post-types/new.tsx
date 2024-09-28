'use client'

import { createPostType } from '@/app/actions/post-types';
import { useRouter } from 'next/navigation';

export default function NewPostType({ siteId }: { siteId: number }) {
  const router = useRouter();

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
      {/* Form fields here */}
      <button type="submit">Create Post Type</button>
    </form>
  );
}

'use client'

import { createSite } from '@/app/actions/sites';
import { useRouter } from 'next/navigation';

export default function NewSite({ teamId }: { teamId: number }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;

    await createSite({
      teamId,
      name,
      domain,
      isActive: true,
    });

    router.push(`/teams/${teamId}/sites`);
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Site Name" required />
      <input name="domain" placeholder="Domain" required />
      <button type="submit">Create Site</button>
    </form>
  );
}

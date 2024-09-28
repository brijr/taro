import { getSites } from '@/app/actions/sites';
import Link from 'next/link';

export default async function SitesPage() {
  // TODO: Replace with actual team ID from user session
  const teamId = 1;
  const sites = await getSites(teamId);

  return (
    <div>
      <h1>Your Sites</h1>
      <Link href="/dashboard/sites/new">Create New Site</Link>
      <ul>
        {sites.map(site => (
          <li key={site.id}>
            <Link href={`/sites/${site.id}`}>{site.name}</Link>
            {site.isActive ? ' (Active)' : ' (Inactive)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

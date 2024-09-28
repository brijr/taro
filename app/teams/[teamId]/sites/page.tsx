import { getSites } from "@/lib/actions/sites";

export default async function SitesPage({
  params,
}: {
  params: { teamId: string };
}) {
  const sites = await getSites(parseInt(params.teamId));

  return (
    <div>
      <h1>Sites</h1>
      <ul>
        {sites.map((site) => (
          <li key={site.id}>
            {site.name} - {site.domain}
          </li>
        ))}
      </ul>
    </div>
  );
}

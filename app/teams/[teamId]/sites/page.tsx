import { getSites } from "@/lib/actions/sites";

export default async function SitesPage({
  params,
}: {
  params: { teamId: string };
}) {
  const sites = await getSites(parseInt(params.teamId));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sites</h1>
      <ul className="space-y-2">
        {sites.map((site) => (
          <li key={site.id} className="bg-gray-100 p-2 rounded">
            <span className="font-semibold">{site.name}</span> - {site.domain}
          </li>
        ))}
      </ul>
    </div>
  );
}

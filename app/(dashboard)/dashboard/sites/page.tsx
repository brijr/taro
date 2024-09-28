import { getSites, deleteSite } from "@/lib/actions/sites";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Site } from "@/lib/db/schema";

export default async function SitesPage() {
  // TODO: Replace with actual team ID from user session
  const teamId = 1;
  const sites = await getSites(teamId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Sites</h1>
      <Link
        href="/dashboard/sites/new"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Site
      </Link>
      <ul className="space-y-2">
        {sites.map((site) => (
          <li
            key={site.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <Link
                href={`/dashboard/sites/${site.id}`}
                className="text-blue-600 hover:underline"
              >
                {site.name}
              </Link>
              <span
                className={`ml-2 ${
                  site.isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                {site.isActive ? "(Active)" : "(Inactive)"}
              </span>
            </div>
            <form action={deleteSite}>
              <input type="hidden" name="id" value={site.id} />
              <Button type="submit" className="ml-4">
                Delete
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

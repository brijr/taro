import { getSites, duplicateSite } from "@/lib/actions/sites";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SitesPage() {
  const sites = await getSites();

  const handleDuplicate = async (siteId: number) => {
    "use server";
    try {
      const newSite = await duplicateSite(siteId);
    } catch (error) {
      console.error(`Error duplicating site: ${error}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Sites</h1>
      <Link
        href="/sites/new"
        className="bg-primary text-primary-foreground px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Site
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sites.map((site) => (
          <div
            key={site.id}
            className="border border-border p-4 rounded flex flex-col justify-between"
          >
            <Link
              href={`/sites/${site.id}`}
              className="text-primary hover:underline text-lg font-semibold mb-2"
            >
              {site.name}
            </Link>
            <div className="flex flex-col space-y-2">
              <form action={handleDuplicate.bind(null, site.id)}>
                <Button type="submit" variant="outline" className="w-full">
                  Duplicate
                </Button>
              </form>
              <Link href={`/sites/${site.id}`} className="w-full">
                <Button className="w-full">Manage</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

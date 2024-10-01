import { getSites, duplicateSite } from "@/lib/actions/sites";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default async function SitesPage() {
  const sites = await getSites();

  const handleDuplicate = async (siteId: number) => {
    "use server";
    try {
      const newSite = await duplicateSite(siteId);
      toast.success(`Site duplicated: ${newSite.name}`);
    } catch (error) {
      console.error("Error duplicating site:", error);
      toast.error("Failed to duplicate site");
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
      <ul className="space-y-2">
        {sites.map((site) => (
          <li
            key={site.id}
            className="border border-border p-2 rounded flex justify-between items-center"
          >
            <Link
              href={`/sites/${site.id}`}
              className="text-primary hover:underline"
            >
              {site.name}
            </Link>
            <div>
              <form
                action={handleDuplicate.bind(null, site.id)}
                className="inline-block mr-2"
              >
                <Button type="submit" variant="outline">
                  Duplicate
                </Button>
              </form>
              <Link href={`/sites/${site.id}`}>
                <Button>Manage</Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { getSites } from "@/lib/actions/sites";
import { getPostTypes } from "@/lib/actions/post-types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteDuplicateButton } from "@/components/SiteDuplicateButton";

export default async function SitePage({
  params,
}: {
  params: { siteId: string };
}) {
  const siteId = parseInt(params.siteId, 10);
  const sites = await getSites();
  const site = sites.find((s) => s.id === siteId);
  const postTypes = await getPostTypes(siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{site.name}</h1>
        <SiteDuplicateButton siteId={siteId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Post Types</h2>
          <ul className="space-y-2">
            {postTypes.map((postType) => (
              <li
                key={postType.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span>{postType.name}</span>
                <div>
                  <Link
                    href={`/sites/${siteId}/post-types/${postType.id}/edit`}
                  >
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                  </Link>
                  <Link
                    href={`/sites/${siteId}/posts/new?postTypeId=${postType.id}`}
                  >
                    <Button size="sm">New Post</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <Link href={`/sites/${siteId}/post-types/new`}>
            <Button className="mt-4">Create New Post Type</Button>
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href={`/sites/${siteId}/posts`}
                className="text-blue-600 hover:underline"
              >
                Manage Posts
              </Link>
            </li>
            <li>
              <Link
                href={`/sites/${siteId}/media`}
                className="text-blue-600 hover:underline"
              >
                Media Library
              </Link>
            </li>
            <li>
              <Link
                href={`/sites/${siteId}/settings`}
                className="text-blue-600 hover:underline"
              >
                Site Settings
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

import { SiteSwitcher } from "@/components/SiteSwitcher";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "@/components/UserNav";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { siteId?: string };
}) {
  const currentSiteId = params.siteId ? parseInt(params.siteId, 10) : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <SiteSwitcher currentSiteId={currentSiteId} />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

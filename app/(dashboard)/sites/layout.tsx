import { BackButton } from "@/components/global/back-button";

export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <BackButton />
      {children}
    </main>
  );
}

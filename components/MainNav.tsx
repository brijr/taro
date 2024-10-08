import Link from "next/link";

export function MainNav({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <Link href="/" className="mr-6 font-medium">
        Dashboard
      </Link>
      <Link href="/sites" className="mr-6 font-medium">
        Sites
      </Link>
    </nav>
  );
}

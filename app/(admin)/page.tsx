import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="grid gap-4">
      <h1>Dashboard</h1>
      <Link className="underline" href="/sites">
        View sites
      </Link>
    </div>
  );
}

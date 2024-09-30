import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <p>Welcome to TaroCMS</p>
      <Link href="/dashboard">Go to Dashboard</Link>
    </main>
  );
}

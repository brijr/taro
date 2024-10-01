"use client";

import { Button } from "@/components/ui/button";
import { handleDuplicate } from "@/app/(admin)/sites/actions";

export function SiteDuplicateButton({ siteId }: { siteId: number }) {
  return (
    <form action={handleDuplicate.bind(null, siteId)}>
      <Button type="submit">Duplicate Site</Button>
    </form>
  );
}

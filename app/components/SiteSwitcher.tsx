"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSites } from "@/lib/actions/sites";

interface Site {
  id: number;
  name: string;
}

export function SiteSwitcher({ currentSiteId }: { currentSiteId?: number }) {
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSites = async () => {
      const fetchedSites = await getSites();
      setSites(fetchedSites);
      const current = fetchedSites.find(site => site.id === currentSiteId);
      if (current) {
        setSelectedSite(current);
      }
    };
    fetchSites();
  }, [currentSiteId]);

  const handleSiteSelect = (site: Site) => {
    setSelectedSite(site);
    setOpen(false);
    router.push(`/sites/${site.id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedSite ? selectedSite.name : "Select site..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search site..." />
          <CommandEmpty>No site found.</CommandEmpty>
          <CommandGroup>
            {sites.map((site) => (
              <CommandItem
                key={site.id}
                onSelect={() => handleSiteSelect(site)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSite?.id === site.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {site.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

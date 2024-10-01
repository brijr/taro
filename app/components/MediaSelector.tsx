"use client";

import { useState, useEffect } from "react";
import { getMedia } from "@/lib/actions/media";
import { Media } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MediaSelectorProps {
  siteId: number;
  onSelect: (media: Media) => void;
}

export function MediaSelector({ siteId, onSelect }: MediaSelectorProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const fetchedMedia = await getMedia(siteId, page, searchTerm);
      setMedia((prev) =>
        page === 1 ? fetchedMedia : [...prev, ...fetchedMedia]
      );
      setHasMore(fetchedMedia.length === 10); // Assuming we fetch 10 items per page
      setPage((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to fetch media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    fetchMedia();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Select Media</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search media..."
            />
          </div>
          <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {media.map((item) => (
              <div
                key={item.id}
                className="border p-2 rounded cursor-pointer hover:border-primary"
                onClick={() => {
                  onSelect(item);
                  toast.success("Media selected");
                }}
              >
                <img
                  src={item.url}
                  alt={item.altText || item.fileName}
                  className="w-full h-32 object-cover"
                />
                <p className="mt-2 text-sm truncate">{item.fileName}</p>
              </div>
            ))}
          </div>
          {hasMore && (
            <Button onClick={handleLoadMore} className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

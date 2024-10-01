import { useState } from "react";
import { getMedia, deleteMedia, updateMedia } from "@/lib/actions/media";
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
import { useToast } from "@/components/ui/use-toast";

export function MediaGallery({ siteId }: { siteId: number }) {
  const [media, setMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchMedia = async () => {
    const fetchedMedia = await getMedia(siteId, page);
    setMedia(prev => [...prev, ...fetchedMedia]);
    setHasMore(fetchedMedia.length === 10); // Assuming we fetch 10 items per page
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleLoadMore = () => {
    fetchMedia();
  };

  const handleDelete = async (id: number) => {
    await deleteMedia(id);
    setMedia(media.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Media deleted successfully",
    });
  };

  const handleUpdate = async (id: number, data: Partial<Media>) => {
    const updated = await updateMedia(id, data);
    setMedia(media.map(item => item.id === id ? updated : item));
    toast({
      title: "Success",
      description: "Media updated successfully",
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <MediaItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
      {hasMore && (
        <Button onClick={handleLoadMore} className="mt-4">
          Load More
        </Button>
      )}
    </div>
  );
}

function MediaItem({ item, onDelete, onUpdate }: {
  item: Media,
  onDelete: (id: number) => Promise<void>,
  onUpdate: (id: number, data: Partial<Media>) => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onUpdate(item.id, {
      altText: formData.get('altText') as string,
      description: formData.get('description') as string,
    });
    setIsEditing(false);
  };

  return (
    <div className="border p-2 rounded">
      <img src={item.url} alt={item.altText || item.fileName} className="w-full h-32 object-cover" />
      <p className="mt-2 text-sm">{item.fileName}</p>
      <div className="mt-2 flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Media</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input id="altText" name="altText" defaultValue={item.altText || ''} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" defaultValue={item.description || ''} />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Button onClick={() => onDelete(item.id)} variant="destructive" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
}

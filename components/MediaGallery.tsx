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

export async function MediaGallery({ siteId }: { siteId: number }) {
  const media = await getMedia(siteId);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <MediaItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function MediaItem({ item }: { item: Media }) {
  return (
    <div className="border p-2 rounded">
      <img
        src={item.url}
        alt={item.altText || item.fileName}
        className="w-full h-32 object-cover"
      />
      <p className="mt-2 text-sm">{item.fileName}</p>
      <div className="mt-2 flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Media</DialogTitle>
            </DialogHeader>
            <form
              action={async (formData: FormData) => {
                const data = Object.fromEntries(formData);
                await updateMedia(item.id, data as Partial<Media>);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  name="altText"
                  defaultValue={item.altText || ""}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={item.altText || ""}
                />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
        <form action={deleteMedia.bind(null, item.id)}>
          <Button type="submit" variant="destructive" size="sm">
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}

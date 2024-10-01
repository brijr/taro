import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSignedUploadUrl, createMedia } from "@/lib/actions/media";
import { toast } from "sonner";

export function MediaUpload({ siteId }: { siteId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  async function handleUpload(formData: FormData) {
    setUploading(true);
    const file = formData.get("file") as File;
    const altText = formData.get("altText") as string;
    if (!file) return;

    try {
      const { uploadUrl, key } = await getSignedUploadUrl(file.name, file.type);

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

      await createMedia(
        {
          siteId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          url,
          altText,
        },
        file
      );

      toast.success("File uploaded successfully");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={handleUpload} className="space-y-4">
      <div>
        <Label htmlFor="file">Choose file</Label>
        <Input id="file" type="file" name="file" onChange={handleFileChange} />
      </div>
      <div>
        <Label htmlFor="altText">Alt Text</Label>
        <Input
          id="altText"
          name="altText"
          type="text"
          placeholder="Describe the image"
        />
      </div>
      <Button type="submit" disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}

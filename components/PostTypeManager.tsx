"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { updatePostType } from "@/lib/actions/post-types";
import { PostType, Field, FIELD_TYPES } from "@/lib/db/schema";
import { toast } from "sonner";

export function PostTypeManager({
  postType: initialPostType,
}: {
  postType: PostType;
}) {
  const [postType, setPostType] = useState<PostType>(initialPostType);

  const handleFieldChange = (id: number, key: keyof Field, value: any) => {
    setPostType((prev) => ({
      ...prev,
      fields: prev.fields.map((field: Field) =>
        field.id === id ? { ...field, [key]: value } : field
      ),
    }));
  };

  const handleAddField = () => {
    const newField: Field = {
      id: Date.now(), // Generate a temporary unique id
      name: "",
      slug: "",
      postTypeId: postType.id,
      type: "text",
      isRequired: false,
      options: [],
      order: postType.fields.length,
    };
    setPostType((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleRemoveField = (id: number) => {
    setPostType((prev) => ({
      ...prev,
      fields: prev.fields.filter((field: Field) => field.id !== id),
    }));
  };

  const handleSave = async () => {
    try {
      await updatePostType(postType.id, {
        name: postType.name,
        fields: postType.fields,
      });
      toast.success("Post type updated successfully");
    } catch (error) {
      toast.error("Failed to update post type");
    }
  };

  return (
    <div className="space-y-6">
      <Input
        value={postType.name}
        onChange={(e) =>
          setPostType((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Post Type Name"
      />
      <ul className="space-y-4">
        {postType.fields.map((field: Field) => (
          <li
            key={field.id}
            className="flex items-center space-x-2 p-2 border rounded"
          >
            <Input
              value={field.name}
              onChange={(e) =>
                handleFieldChange(field.id, "name", e.target.value)
              }
              placeholder="Field Name"
            />
            <Select
              value={field.type}
              onValueChange={(value) =>
                handleFieldChange(field.id, "type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.isRequired}
                onCheckedChange={(checked) =>
                  handleFieldChange(field.id, "isRequired", checked)
                }
              />
              <label htmlFor={`required-${field.id}`} className="ml-2">
                Required
              </label>
            </div>
            <Button
              onClick={() => handleRemoveField(field.id)}
              variant="destructive"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button onClick={handleAddField}>Add Field</Button>
      <Button onClick={handleSave}>Save Post Type</Button>
    </div>
  );
}

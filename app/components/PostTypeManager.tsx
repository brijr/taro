"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { updatePostType } from "@/lib/actions/post-types";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface PostType {
  id: number;
  name: string;
  fields: Field[];
}

const fieldTypes = [
  "text",
  "textarea",
  "number",
  "checkbox",
  "radio",
  "select",
  "date",
  "time",
  "color",
  "rich-text",
];

export function PostTypeManager({
  postType: initialPostType,
}: {
  postType: PostType;
}) {
  const [postType, setPostType] = useState<PostType>(initialPostType);

  const handleFieldChange = (id: string, key: keyof Field, value: any) => {
    setPostType((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      ),
    }));
  };

  const handleAddField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      name: "",
      type: "text",
      required: false,
    };
    setPostType((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleRemoveField = (id: string) => {
    setPostType((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(postType.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPostType((prev) => ({ ...prev, fields: items }));
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

  const renderFieldTypeSpecificInputs = (field: Field) => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={`fieldOptions-${field.id}`}
            placeholder="Enter default text..."
            className="mt-2"
          />
        );
      case "select":
      case "radio":
        return (
          <div className="mt-2">
            <Label htmlFor={`fieldOptions-${field.id}`}>
              Options (comma-separated)
            </Label>
            <Input
              id={`fieldOptions-${field.id}`}
              value={field.options?.join(", ") || ""}
              onChange={(e) =>
                handleFieldChange(
                  field.id,
                  "options",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              placeholder="Option 1, Option 2, Option 3"
            />
          </div>
        );
      case "date":
        return (
          <div className="mt-2">
            <Label>Default Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.options && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.options ? (
                    format(new Date(field.options[0]), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    field.options ? new Date(field.options[0]) : undefined
                  }
                  onSelect={(date) =>
                    handleFieldChange(
                      field.id,
                      "options",
                      date ? [date.toISOString()] : undefined
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case "color":
        return (
          <div className="mt-2">
            <Label htmlFor={`fieldOptions-${field.id}`}>Default Color</Label>
            <Input
              id={`fieldOptions-${field.id}`}
              type="color"
              value={field.options?.[0] || "#000000"}
              onChange={(e) =>
                handleFieldChange(field.id, "options", [e.target.value])
              }
              className="h-10 w-full"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="postTypeName">Post Type Name</Label>
        <Input
          id="postTypeName"
          value={postType.name}
          onChange={(e) =>
            setPostType((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {postType.fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border p-4 rounded"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`fieldName-${field.id}`}>
                            Field Name
                          </Label>
                          <Input
                            id={`fieldName-${field.id}`}
                            value={field.name}
                            onChange={(e) =>
                              handleFieldChange(
                                field.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`fieldType-${field.id}`}>
                            Field Type
                          </Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) =>
                              handleFieldChange(field.id, "type", value)
                            }
                          >
                            <SelectTrigger id={`fieldType-${field.id}`}>
                              <SelectValue>{field.type}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {renderFieldTypeSpecificInputs(field)}
                      <div className="mt-2 flex items-center">
                        <Switch
                          id={`fieldRequired-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            handleFieldChange(field.id, "required", checked)
                          }
                        />
                        <Label
                          htmlFor={`fieldRequired-${field.id}`}
                          className="ml-2"
                        >
                          Required
                        </Label>
                      </div>
                      <Button
                        onClick={() => handleRemoveField(field.id)}
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                      >
                        Remove Field
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button onClick={handleAddField}>Add Field</Button>
      <Button onClick={handleSave}>Save Post Type</Button>
    </div>
  );
}

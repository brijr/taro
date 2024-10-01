"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RichTextEditor } from "./RichTextEditor";
import { MediaSelector } from "./MediaSelector";
import { toast } from "sonner";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  siteId: number;
}

export function DynamicForm({ fields, onSubmit, siteId }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            id={field.id}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            id={field.id}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            id={field.id}
            checked={formData[field.name] || false}
            onCheckedChange={(checked) =>
              handleInputChange(field.name, checked)
            }
            required={field.required}
          />
        );
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => handleInputChange(field.name, value)}
            required={field.required}
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => handleInputChange(field.name, value)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !formData[field.name] && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData[field.name] ? (
                  format(formData[field.name], "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData[field.name]}
                onSelect={(date) => handleInputChange(field.name, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "time":
        return (
          <Input
            type="time"
            id={field.id}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "color":
        return (
          <Input
            type="color"
            id={field.id}
            value={formData[field.name] || "#000000"}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "rich-text":
        return (
          <RichTextEditor
            value={formData[field.name] || ""}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        );
      case "media":
        return (
          <MediaSelector
            siteId={siteId}
            onSelect={(media) => {
              handleInputChange(field.name, media.url);
              toast.success("Media selected");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id}>
          <Label htmlFor={field.id}>{field.name}</Label>
          {renderField(field)}
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );
}

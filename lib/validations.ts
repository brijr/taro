import { z } from "zod";
import { fieldSchema } from "./schemas/field";

export const postTypeSchema = z.object({
  siteId: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  fields: z.array(fieldSchema),
  isActive: z.boolean().default(true),
});

// Other schemas and validations...
export { fieldSchema };

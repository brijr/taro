import { z } from "zod";

export const fieldSchema = z.object({
  name: z.string(),
  slug: z.string(),
  postTypeId: z.number(),
  type: z.string(),
  isRequired: z.boolean(),
  options: z.array(z.string()).optional(),
  order: z.number(),
});

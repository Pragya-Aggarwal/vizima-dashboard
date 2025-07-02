
import { z } from "zod";


export const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  order: z.coerce.number()
    .min(0, "Order number must be 0 or greater"),
  imageUrl: z.string().url("Valid image URL is required"),
  isVisible: z.boolean(), 

});

export type SchemaFormData = z.infer<typeof Schema>;


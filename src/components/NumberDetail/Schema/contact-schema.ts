import { z } from "zod";

export const contactSchema = z.object({
  number: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
  order: z.coerce.number()
    .min(0, "Order must be 0 or greater")
    .default(0)
});

export type ContactFormData = z.infer<typeof contactSchema>;

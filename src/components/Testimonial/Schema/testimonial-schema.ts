
import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  comment: z.string().min(1, "Comment is required"),
  city: z.string().min(1, "City is required"),

  picture: z.string().url("Valid image URL is required"),


  rating: z.coerce.number()
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),

  order: z.coerce.number()
    .min(0, "Order number must be 0 or greater"),

  status: z.enum(["approved", "pending", "rejected"], {
    required_error: "Status is required",
  }),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;


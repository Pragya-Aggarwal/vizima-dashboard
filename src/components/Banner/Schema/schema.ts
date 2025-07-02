
// import { z } from "zod";


// export const Schema = z.object({
//   name: z.string().min(1, "Name is required"),
//   order: z.coerce.number()
//     .min(0, "Order number must be 0 or greater"),
//   imageUrl: z.string().url("Valid image URL is required"),
//   isVisible: z.boolean(), 

// });

// export type SchemaFormData = z.infer<typeof Schema>;



import { z } from "zod";

export const Schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Image URL is required"),
  link: z.string().url("Valid link is required"),
  isActive: z.boolean(),
  order: z.coerce.number().min(0, "Order must be 0 or greater"),
  type: z.enum(["hero", "promotional", "informational", "featured"]),
  targetAudience: z.enum(["all", "new_user", "existing_user", "premium_users"]),
  displayLocation: z.array(z.enum(["home", "search", "booking", "profile"])).min(1, "Select at least one location"),
  // startDate: z.string().datetime(),
  // endDate: z.string().datetime(),
});

export type SchemaFormData = z.infer<typeof Schema>;

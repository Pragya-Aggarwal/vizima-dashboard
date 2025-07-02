
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
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone is required"),
  avatar: z.string().url("Valid avatar URL required").optional(),
  role: z.enum(["user", "admin"]),
  isVerified: z.boolean(),
  preferences: z.object({
    priceRange: z.object({
      min: z.number(),
      max: z.number()
    }).optional(),
    propertyType: z.array(z.string()).optional()
  }).optional()
});

export type SchemaFormData = z.infer<typeof Schema>;

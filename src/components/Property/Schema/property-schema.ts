import { z } from "zod"

export type RoomType = 'single' | 'double' | 'triple' | 'quad';

export type SharingType = {
  type: RoomType;
  price: number;
  description?: string;
};

export const propertySchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.string().min(1, "Type is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number"),
    gender: z.string().min(1, "Gender is required"),
    bulkAccommodation: z.boolean(),
    bulkAccommodationType: z.array(z.string()).min(0, "Select at least one"),
    sharingType: z.array(
      z.object({
        type: z.enum(['single', 'double', 'triple', 'quad']),
        price: z.number().min(0, "Price must be a positive number"),
        description: z.string().optional()
      })
    ).min(1, "At least one sharing type is required"),
 
    location: z.object({
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        coordinates: z.object({
            lat: z.coerce.number(),
            lng: z.coerce.number()
        }),
    }),
    amenities: z.array(z.string()).min(0, "Select at least one amenity"),

    // images: z.array(z.string()).optional().default([]),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
    area: z.coerce.number().min(0, "Area is required"),
    isAvailable: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    rules: z.array(z.string()).optional().default([]),
    microSiteLink: z.string().optional(),
    youtubeLink: z.string().optional(),
    nearbyPlaces: z
        .array(
            z.object({
                name: z.string().min(1, "Place name is required"),
                distance: z.string().min(1, "Distance is required"),
                type: z.string().min(1, "Type is required"),
            })
        )
        .optional()
        .default([]),
})

export type PropertyFormData = z.infer<typeof propertySchema>

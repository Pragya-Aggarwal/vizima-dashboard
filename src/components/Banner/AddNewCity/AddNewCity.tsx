import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus,
    FolderSyncIcon as Sync,
    Upload, ImageIcon, Trash2
} from "lucide-react"

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Schema, SchemaFormData } from "../Schema/schema"
import { useState } from "react"
import { uploadToCloudinary } from "@/lib/utils/uploadToCloudinary"
import { useRef } from "react"
import { addBanner } from "@/src/services/Banner"
import { toast } from "sonner"

type AddCityModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: SchemaFormData, onSuccess: () => void) => void;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const AddCityModal = ({ open, setOpen, onSubmit, selectedFile, setSelectedFile }: AddCityModalProps) => {
    const {
        register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset, trigger
    } = useForm<SchemaFormData>({
        resolver: zodResolver(Schema),

        defaultValues: {
            name: "",
            type: "",
            city: "",
            area: "",
            rooms: 0,
            price: 0,
            deposit: 0,
            description: "",
            featured: false,
            amenities: [],
            bulkAccommodationType: [],
            sharingType: [],
            rules: [],
            nearbyPlaces: [], // ✅ must be array of objects



            images: [],
            isAvailable: false,  // ✅ very important
            isFeatured: false,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearbyPlaces",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const onFormSubmit = async (formData: SchemaFormData) => {
    try {
      
      // 1. Upload image to Cloudinary if a file is selected
      let imageUrl = formData.image; // Default to the existing image URL if any
      
      if (selectedFile) {
        try {
          imageUrl = await uploadToCloudinary(selectedFile);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
          return;
        }
      }
      
      // 2. Prepare the banner data for the API
      const bannerData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        link: formData.link,
        isActive: formData.isActive,
        order: Number(formData.order) || 0,
        type: formData.type,
        targetAudience: formData.targetAudience,
        displayLocation: formData.displayLocation || [],
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      
      // 3. Call the API to create the banner
      const response = await addBanner(bannerData);
      
      // 4. Show success message
      toast.success("Banner created successfully");
      
      // 5. Reset form and close modal
      reset();
      setSelectedFile(null);
      setOpen(false);
      
      // 6. Call the parent's onSuccess callback if provided
      if (onSubmit) {
        onSubmit(bannerData, () => {
          // Additional success handling if needed
        });
      }
      
    } catch (error: any) {
      console.error("Error creating banner:", error);
      toast.error(error?.response?.data?.message || "Failed to create banner");
    } finally {
      
    }
  };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Banner</DialogTitle>
                    <DialogDescription>Create a new Banners</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                        {/* Title & Description */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input {...register("title")} placeholder="Banner title" />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input {...register("description")} placeholder="Banner description" />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>
                        </div>

                        {/* Link & Order */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Link</Label>
                                <Input {...register("link")} placeholder="https://..." />
                                {errors.link && <p className="text-sm text-red-500">{errors.link.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Order</Label>
                                <Input type="number" {...register("order")} placeholder="0" />
                                {errors.order && <p className="text-sm text-red-500">{errors.order.message}</p>}
                            </div>
                        </div>

                        {/* Type & Target Audience */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Controller
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hero">Hero</SelectItem>
                                                <SelectItem value="promotional">Promotional</SelectItem>
                                                <SelectItem value="informational">Informational</SelectItem>
                                                <SelectItem value="featured">Featured</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Target Audience</Label>
                                <Controller
                                    control={control}
                                    name="targetAudience"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="new_user">New Users</SelectItem>
                                                <SelectItem value="existing_user">Existing Users</SelectItem>
                                                <SelectItem value="premium_users">Premium Users</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.targetAudience && <p className="text-sm text-red-500">{errors.targetAudience.message}</p>}
                            </div>
                        </div>

                        {/* Display Locations (Multi-select) */}
                        <div className="space-y-2">
                            <Label>Display Locations</Label>

                            <Controller
                                control={control}
                                name="displayLocation"
                                render={({ field }) => (
                                    <select
                                        id="displayLocation"
                                        multiple
                                        className="w-full border rounded px-3 py-2"
                                        value={field.value || []}
                                        onChange={(e) =>
                                            field.onChange(
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        <option value="home">Home</option>
                                        <option value="search">Search</option>
                                        <option value="booking">Booking</option>
                                        <option value="profile">Profile</option>
                                    </select>
                                )}
                            />

                            {errors.displayLocation && <p className="text-sm text-red-500">{errors.displayLocation.message}</p>}
                        </div>

                        {/* Start and End Date */}
                        {/* <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="datetime-local" {...register("startDate")} />
                                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="datetime-local" {...register("endDate")} />
                                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                            </div>
                        </div> */}


                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="datetime-local"
                                    {...register("startDate")}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="datetime-local"
                                    {...register("endDate")}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>


                        {/* Active Toggle */}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Controller
                                control={control}
                                name="isActive"
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={(val) => field.onChange(val === "true")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.isActive && <p className="text-sm text-red-500">{errors.isActive.message}</p>}
                        </div>

                        {/* Image Upload */}
                        {/* <Controller
                            control={control}
                            name="image"
                            render={({ field }) => (
                                <UploadImageField field={field} error={errors.image?.message} />
                            )}
                        /> */}


                        <Controller
                            control={control}
                            name="image"
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <Label>Customer Image</Label>

                                    <div
                                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Drag & drop image or click to browse
                                        </p>
                                        <Button variant="outline" className="mt-2">
                                            <ImageIcon className="h-4 w-4 mr-2" />
                                            Upload Image
                                        </Button>
                                        {/* <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                    const url = await uploadToCloudinary(file);
                                                    field.onChange(url); // ✅ only set single URL
                                                    console.log("Uploaded Image URL =>", url);
                                                } catch (err) {
                                                    console.error("Upload failed:", err);
                                                }
                                            }}
                                        /> */}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedFile(file); // for FormData
                                                    field.onChange(URL.createObjectURL(file)); // for preview + validation
                                                }
                                            }}

                                        />
                                    </div>

                                    {/* Show uploaded image preview */}
                                    {field.value && (
                                        <div className="relative w-32 h-32 mt-4">
                                            <img
                                                src={field.value}
                                                alt="uploaded"
                                                className="w-full h-full object-cover rounded"
                                            />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-1 right-1 w-6 h-6"
                                                onClick={() => field.onChange("")}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}

                                    {errors.image && (
                                        <p className="text-sm text-red-500">{errors.image.message}</p>
                                    )}
                                </div>
                            )}
                        />


                        {/* Submit */}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Add Banner"}
                            </Button>
                        </div>
                    </form>




                </div>
            </DialogContent >
        </Dialog >
    )


}


export default AddCityModal
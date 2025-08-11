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
import { useState, useRef } from "react"
import { uploadToCloudinary, deleteImage } from "@/lib/utils/uploadToCloudinary"
import { toast } from "sonner"

type AddCityModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: SchemaFormData, onSuccess: () => void) => void
}

const AddCityModal = ({ open, setOpen, onSubmit: onSubmitProp }: AddCityModalProps) => {
    const {
        register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset, trigger
    } = useForm<SchemaFormData>({
        resolver: zodResolver(Schema),

        defaultValues: {
            name: "",
            order: 0,
            imageUrl: "",
            isVisible: false,
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

    const onFormSubmit = (data: SchemaFormData) => {
        // Ensure we only pass the fields defined in the schema
        const formData: SchemaFormData = {
            name: data.name,
            order: data.order,
            imageUrl: data.imageUrl,
            isVisible: data.isVisible
        };
        
        onSubmitProp(formData, () => {
            reset();
            setOpen(false);
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset form when dialog is closed via outside click or cancel
            reset({
                name: "",
                order: 0,
                imageUrl: "",
                isVisible: false,
                amenities: [],
                bulkAccommodationType: [],
                sharingType: [],
                rules: [],
                nearbyPlaces: [],
                images: [],
                isAvailable: false,
                isFeatured: false,
            });
        }
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                    <DialogDescription>Create a new City</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">

                        {/* Title & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">City Name</Label>
                                <Input id="name" {...register("name")} placeholder="Enter Name" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* rating */}

                            <div className="space-y-2">
                                <Label htmlFor="rating">Available</Label>

                                <Controller
                                    control={control}
                                    name="isVisible"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(val) => field.onChange(val === "true")}
                                            value={field.value === true ? "true" : "false"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select availability" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Available</SelectItem>
                                                <SelectItem value="false">Not Available</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.isVisible && <p className="text-sm text-red-500">{errors.isVisible.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="Order">Order</Label>
                            <Input id="order" {...register("order")} placeholder="Order" type="number" />
                            {errors.order && <p className="text-sm text-red-500">{errors.order.message}</p>}
                        </div>

                        <Controller
                            control={control}
                            name="imageUrl"
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <Label>Customer Image</Label>

                                    <div
                                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          fileInputRef.current?.click();
                                        }}
                                    >
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Drag & drop image or click to browse
                                        </p>
                                        <div className="mt-2">
                                          <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              fileInputRef.current?.click();
                                            }}
                                          >
                                            <ImageIcon className="h-4 w-4 mr-2" />
                                            Upload Image
                                          </Button>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={async (e) => {
                                                e.stopPropagation();
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                    const url = await uploadToCloudinary(file, true); // true for single image upload
                                                    field.onChange(url);
                                                } catch (err) {
                                                    console.error("Upload failed:", err);
                                                } finally {
                                                  if (e.target) {
                                                    e.target.value = '';
                                                  }
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
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        const fileName = field.value.split('/').pop() || '';
                                                        if (fileName) {
                                                            await deleteImage(fileName);
                                                            field.onChange("");
                                                            toast.success("Image deleted successfully");
                                                        }
                                                    } catch (error) {
                                                        console.error("Error deleting image:", error);
                                                        toast.error("Failed to delete image");
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}

                                    {errors.imageUrl && (
                                        <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                                    )}
                                </div>
                            )}
                        />


                        {/* end near by plase */}

                        {/* Submit */}
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Create City"}
                            </Button>
                        </div>
                    </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default AddCityModal
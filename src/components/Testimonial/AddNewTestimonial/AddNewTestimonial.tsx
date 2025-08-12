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
// import { propertySchema, PropertyFormData } from "../../Property/Schema/property-schema"
import { testimonialSchema, TestimonialFormData } from "../Schema/testimonial-schema"
import { useState } from "react"
import { uploadToCloudinary, deleteImage } from "@/lib/utils/uploadToCloudinary"
import { toast } from "sonner"
import { useRef } from "react"

type AddPropertyModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: TestimonialFormData, onSuccess: () => void) => void
}

const AddTestimonialModal = ({ open, setOpen, onSubmit }: AddPropertyModalProps) => {
    const {
        register, 
        control, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset, 
        setValue, 
        watch
    } = useForm<TestimonialFormData>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            name: "",
            comment: "",
            city: "",
            picture: "",
            rating: 5,
            order: 0,
            status: "pending" as const,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearbyPlaces",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onFormSubmit = (data: TestimonialFormData) => {
        onSubmit(data, () => {
            reset({
                name: "",
                comment: "",
                city: "",
                picture: "",
                rating: 5,
                order: 0,
                status: "pending" as const,
            });
            setOpen(false);
        });
    };


    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset form when dialog is closed via outside click or cancel
            reset({
                name: "",
                comment: "",
                city: "",
                picture: "",
                rating: 0,
                order: 0,
                status: "pending" as const,
            });
        }
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Testimonial</DialogTitle>
                    <DialogDescription>Create a new Testimonial</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">

                        {/* Title & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Customer Name</Label>
                                <Input id="name" {...register("name")} placeholder="Enter Name" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* rating */}
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Controller
                                    control={control}
                                    name="rating"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">One</SelectItem>
                                                <SelectItem value="2">Two</SelectItem>
                                                <SelectItem value="3">Three</SelectItem>
                                                <SelectItem value="4">Four</SelectItem>
                                                <SelectItem value="5">Five</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Select Status</Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="reject">Reject</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Description</Label>
                            <Textarea id="comment" {...register("comment")} placeholder="Enter description" rows={3} />
                            {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...register("city")} placeholder="New York" />
                                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location.state">Order</Label>
                                <Input id="order" {...register("order")} placeholder="Order" type="number" />
                            </div>
                        </div>


                        <Controller
                            control={control}
                            name="picture"
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <Label>Profile Picture</Label>

                                    <div
                                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Drag & drop an image or click to browse
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
                                                {field.value ? 'Change Image' : 'Upload Image'}
                                            </Button>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                
                                                try {
                                                    // If there's an existing image, delete it first
                                                    if (field.value) {
                                                        try {
                                                            await deleteImage(field.value);
                                                        } catch (deleteError) {
                                                            console.error('Failed to delete old image:', deleteError);
                                                            // Continue with upload even if deletion fails
                                                        }
                                                    }
                                                    
                                                    const url = await uploadToCloudinary(file);
                                                    field.onChange(url);
                                                } catch (err) {
                                                    console.error("Upload failed:", err);
                                                    toast.error("Failed to upload image");
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
                                        <div className="relative w-full max-w-xs">
                                            <img 
                                                src={field.value} 
                                                alt="profile-preview" 
                                                className="w-full h-48 object-cover rounded-lg" 
                                            />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    try {
                                                        if (field.value) {
                                                            await deleteImage(field.value);
                                                            field.onChange("");
                                                        }
                                                    } catch (error) {
                                                        console.error('Failed to delete image:', error);
                                                        toast.error("Failed to delete image");
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}

                                    {errors.picture && (
                                        <p className="text-sm text-red-500">{errors.picture.message}</p>
                                    )}
                                </div>
                            )}
                        />


                        {/* end near by plase */}

                        {/* Submit */}
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Create Testimonial"}
                            </Button>
                        </div>
                    </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default AddTestimonialModal
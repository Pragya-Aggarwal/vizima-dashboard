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
import { uploadToCloudinary } from "@/lib/utils/uploadToCloudinary"
import { useRef } from "react"

type AddPropertyModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: TestimonialFormData, onSuccess: () => void) => void
}

const AddTestimonialModal = ({ open, setOpen, onSubmit }: AddPropertyModalProps) => {
    const {
        register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset, trigger
    } = useForm<TestimonialFormData>({
        resolver: zodResolver(testimonialSchema),



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

    const onFormSubmit = (data: TestimonialFormData) => {
        console.log("Submitted Data testimonial =>", data);

        onSubmit(data, () => {
            reset();
            setOpen(false);
        });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                                        <input
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
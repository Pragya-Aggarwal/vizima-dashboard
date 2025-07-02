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

type AddCityModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: SchemaFormData, onSuccess: () => void) => void
}

const AddCityModal = ({ open, setOpen, onSubmit }: AddCityModalProps) => {
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

    const onFormSubmit = (data: SchemaFormData) => {
        console.log("Submitted city add time", data);
        onSubmit(data, () => {
            reset();
            setOpen(false);
        });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                    <DialogDescription>Create a new City</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">

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
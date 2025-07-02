"use client"
import { useEffect } from "react"

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
// import { getTestimonialById } from "@/src/services/testmonialServices"
// import { getCityById } from "@/src/services/cityServices"
import { getUserById } from "@/src/services/User"


type SchemaModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: SchemaFormData, onSuccess: () => void) => void
    testimonialId: string | null;

}

const UpdateModal = ({ open, setOpen, onSubmit, testimonialId }: SchemaModalProps) => {
    const {
        register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset, trigger
    } = useForm<SchemaFormData>({
        resolver: zodResolver(Schema),

        defaultValues: {
            name: "",
            order: 0,
            imageUrl: "",
            isVisible: false,
        }

    })


    console.log("upfdate page id", testimonialId)

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearbyPlaces",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onFormSubmit = (data: SchemaFormData) => {
        console.log("Submitted Data for update user =>", data);
        onSubmit(data, () => {
            reset();
            setOpen(false);
        });
    };



    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (testimonialId && open) {
    //             try {
    //                 const response = await getUserById(testimonialId);

    //                 console.log("single response data testinmonial update city page", response)
    //                 const data = response;


    //                 if (data) {
    //                     reset({
    //                         name: data.name || "",
    //                         imageUrl: data.imageUrl || "",
    //                         order: data.order || 0,
    //                         isVisible: data.isVisible ?? false,
    //                     });
    //                 }

    //             } catch (err) {
    //                 console.error("Failed to fetch testimonial:", err);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [testimonialId, open, reset]);



    useEffect(() => {
        const fetchData = async () => {
            if (testimonialId && open) {
                try {
                    const response = await getUserById(testimonialId);
                    const data = response?.data;

                    if (data) {
                        reset({
                            name: data.name || "",
                            email: data.email || "",
                            phone: data.phone || "",
                            avatar: data.avatar || "",
                            role: data.role || "user",
                            isVerified: !!data.isVerified,
                            preferences: data.preferences || {}
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                }
            }
        };

        fetchData();
    }, [testimonialId, open, reset]);




    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update User Information</DialogTitle>
                    <DialogDescription>Update a Existing User</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input {...register("name")} placeholder="Enter name" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input {...register("email")} placeholder="Enter email" />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input {...register("phone")} placeholder="Enter phone" />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                            </div>

                            {/* isVerified */}
                            <div className="space-y-2">
                                <Label>Verification</Label>
                                <Controller
                                    name="isVerified"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ? "true" : "false"}
                                            onValueChange={(val) => field.onChange(val === "true")}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Verified</SelectItem>
                                                <SelectItem value="false">Not Verified</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.isVerified && <p className="text-sm text-red-500">{errors.isVerified.message}</p>}
                            </div>
                        </div>

                        {/* Avatar Image Upload */}
                        {/* <Controller
                            name="avatar"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <Label>Avatar</Label>
                                    <Input
                                        type="text"
                                        placeholder="Paste image URL or upload"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {field.value && (
                                        <img
                                            src={field.value}
                                            alt="Avatar"
                                            className="w-16 h-16 rounded-full mt-2 object-cover"
                                        />
                                    )}
                                    {errors.avatar && <p className="text-sm text-red-500">{errors.avatar.message}</p>}
                                </div>
                            )}
                        /> */}



                        <Controller
                            control={control}
                            name="avatar"
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

                                    {errors.avatar && (
                                        <p className="text-sm text-red-500">{errors.avatar.message}</p>
                                    )}
                                </div>
                            )}
                        />


                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Update User"}
                            </Button>
                        </div>


                    </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default UpdateModal
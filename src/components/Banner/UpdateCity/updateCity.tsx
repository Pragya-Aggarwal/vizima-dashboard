"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, Controller, useFieldArray, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Upload, ImageIcon, Trash2 } from "lucide-react"
// Define Banner type locally to avoid conflicts
// Define a more specific type for the banner data
type BannerType = {
    _id: string;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
    order: number;
    type: string;
    targetAudience: string;
    displayLocation: string[];
    startDate?: string | Date;
    endDate?: string | Date;
    link: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown; // Use unknown instead of any for better type safety
};

// Helper function to safely access banner properties
function getBannerProperty<T>(banner: BannerType | null, key: string, defaultValue: T): T {
    if (!banner) return defaultValue;
    const value = banner[key as keyof BannerType];
    return value as T ?? defaultValue;
}
import { toast } from "sonner"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Schema and Types
import { Schema, SchemaFormData } from "../Schema/schema"
import { uploadToCloudinary } from "@/lib/utils/uploadToCloudinary"
import { getBannerById, updateBannerById } from "@/src/services/Banner"

interface UpdateModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: () => void;
    testimonialId: string | null;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const UpdateModal = ({
    open,
    setOpen,
    testimonialId,
    selectedFile,
    setSelectedFile,
    refetch
}: UpdateModalProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SchemaFormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            title: "",
            description: "",
            image: "",
            link: "",
            isActive: false,
            order: 0,
            type: "hero",
            targetAudience: "all",
            displayLocation: [],
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    // Watch form values
    const formValues = watch();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "displayLocation",
    });

    // Get the current values of displayLocation
    const displayLocations = watch("displayLocation") || [];

    // Add a location to the displayLocation array
    const addLocation = (location: "home" | "search" | "booking" | "profile") => {
        if (!displayLocations.includes(location)) {
            append(location);
        }
    };

    // Remove a location from the displayLocation array
    const removeLocation = (index: number) => {
        remove(index);
    };

    // Format date for datetime-local input with proper type handling
    const formatDateForInput = (date: unknown): string => {
        if (!date) return '';
        try {
            const d = typeof date === 'string' || date instanceof Date ? new Date(date) : null;
            if (!d || isNaN(d.getTime())) return ''; // Handle invalid dates
            return d.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Fetch banner data when the modal opens or testimonialId changes
    useEffect(() => {
        const fetchBanner = async () => {
            if (!testimonialId || !open) return;

            try {
                setIsLoading(true);
                const response = await getBannerById(testimonialId);

                if (response && response.data) {
                    const bannerData = response.data;

                    // Convert string dates to Date objects
                    const startDate = bannerData.startDate
                        ? new Date(bannerData.startDate)
                        : new Date();

                    const endDate = bannerData.endDate
                        ? new Date(bannerData.endDate)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                    // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
                    const formatForInput = (date: Date) => {
                        const pad = (num: number) => num.toString().padStart(2, '0');
                        const year = date.getFullYear();
                        const month = pad(date.getMonth() + 1);
                        const day = pad(date.getDate());
                        const hours = pad(date.getHours());
                        const minutes = pad(date.getMinutes());
                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                    };

                    // Reset form with fetched data
                    reset({
                        title: bannerData.title || "",
                        description: bannerData.description || "",
                        image: bannerData.image || "",
                        link: bannerData.link || "",
                        isActive: bannerData.isActive ?? false,
                        order: bannerData.order || 0,
                        type: bannerData.type || "hero",
                        targetAudience: bannerData.targetAudience || "all",
                        displayLocation: Array.isArray(bannerData.displayLocation)
                            ? bannerData.displayLocation
                            : [],
                        startDate: formatForInput(startDate),
                        endDate: formatForInput(endDate),
                    });
                }
            } catch (error) {
                console.error("Error fetching banner:", error);
                toast.error("Failed to load banner data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanner();

        // Cleanup function to reset form when modal closes
        return () => {
            if (!open) {
                reset();
                setSelectedFile(null);
            }
        };
    }, [testimonialId, open, reset, setSelectedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setValue("image", URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setValue("image", "");
    };

    const onFormSubmit: SubmitHandler<SchemaFormData> = async (formData) => {
        console.log(formData,"formData");
        try {
            setIsLoading(true);

            // If there's a new image, upload it first
            let imageUrl = formData.image;
            if (selectedFile) {
                try {
                    imageUrl = await uploadToCloudinary(selectedFile);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    toast.error("Failed to upload image");
                    return;
                }
            }

            // Ensure displayLocation is an array and has at least one value
            const displayLocations = Array.isArray(formData.displayLocation) && formData.displayLocation.length > 0
                ? formData.displayLocation
                : ["home"]; // Default value if empty

            // Prepare the data to submit according to API requirements
            const dataToSubmit = {
                title: formData.title,
                description: formData.description,
                image: imageUrl,
                link: formData.link,
                isActive: formData.isActive,
                order: formData.order,
                type: formData.type,
                targetAudience: formData.targetAudience,
                displayLocation: displayLocations,
                startDate: formData.startDate instanceof Date ? formData.startDate.toISOString() : formData.startDate,
                endDate: formData.endDate instanceof Date ? formData.endDate.toISOString() : formData.endDate,
            };

            if (!testimonialId) {
                throw new Error("Banner ID is required for update");
            }

            // Call the update API
            await updateBannerById(testimonialId, dataToSubmit);

            // Show success message
            toast.success("Banner updated successfully");

            // Reset form and close modal
            reset();
            setOpen(false);
            setSelectedFile(null);
            refetch();
            // Call the success callback if provided
            // if (onSuccess) {
            //     onSuccess();
            // }
        } catch (error) {
            console.error("Error updating banner:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Loading Banner</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }



    // Removed duplicate useEffect that was fetching the same data



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Banner</DialogTitle>
                    <DialogDescription>Update a Existing Banner</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">

                        {/* Title & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" {...register("title")} placeholder="Enter Title" />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" {...register("description")} placeholder="Enter Description" />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Link</Label>
                                <Input id="link" {...register("link")} placeholder="Enter Link" />
                                {errors.link && <p className="text-sm text-red-500">{errors.link.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    {...register("order", { valueAsNumber: true })}
                                    placeholder="Enter Order"
                                />
                                {errors.order && <p className="text-sm text-red-500">{errors.order.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Display Location</Label>
                                <div className="flex flex-wrap gap-2">
                                    {["home", "search", "booking", "profile"].map((location) => (
                                        <div key={location} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={location}
                                                value={location}
                                                {...register("displayLocation")}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor={location} className="capitalize">{location}</Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.displayLocation && (
                                    <p className="text-sm text-red-500">{errors.displayLocation.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="startDate"
                                                type="datetime-local"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                    {errors.startDate && (
                                        <p className="text-sm text-red-500">{errors.startDate.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="endDate"
                                                type="datetime-local"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                    {errors.endDate && (
                                        <p className="text-sm text-red-500">{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Banner"}
                            </Button>
                        </div>
                    </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default UpdateModal;
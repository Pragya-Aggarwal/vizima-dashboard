"use client"

import { useEffect, useState, useRef } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getCityById } from "@/src/services/cityServices"
import { uploadToCloudinary } from "@/lib/utils/uploadToCloudinary"
import { CityFormData } from "@/types/city"

type UpdateCityModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: CityFormData, onSuccess: () => void) => void
    cityId: string
}

const UpdateModal = ({ open, setOpen, onSubmit, cityId }: UpdateCityModalProps) => {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
console.log(cityId,"cityId")
    const {
        register, 
        control, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        setValue, 
        watch, 
        reset, 
        trigger
    } = useForm<CityFormData>({
        defaultValues: {
            name: "",
            order: 0,
            imageUrl: "",
            isVisible: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearbyPlaces",
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setValue("imageUrl", url);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setValue("imageUrl", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onFormSubmit = (data: CityFormData) => {
        const formData = {
            ...data,
            isVisible: data.isVisible ?? false,
            order: Number(data.order) || 0,
            nearbyPlaces: data.nearbyPlaces?.map(place => ({
                ...place,
                order: Number(place.order) || 0
            })) || []
        };
        
        onSubmit(formData, () => {
            setOpen(false);
            reset();
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!cityId) return;
            try {
                const res = await getCityById(cityId);
                if (res) {
                    reset({
                        name: res.name || "",
                        imageUrl: res.imageUrl || "",
                        isVisible: res.isVisible || false,
                        order: res.order || 0,
                        nearbyPlaces: res.nearbyPlaces?.map((place: any) => ({
                            _id: place._id,
                            name: place.name || "",
                            description: place.description || "",
                            imageUrl: place.imageUrl || "",
                            order: place.order || 0
                        })) || []
                    });
                }
            } catch (error) {
                console.error("Error fetching city:", error);
            }
        };
        fetchData();
    }, [cityId, reset]);



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update City</DialogTitle>
                    <DialogDescription>Update a Existing City</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

                        {/* Title & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">City Name</Label>
                                <Input id="name" {...register("name")} placeholder="Enter Name" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* rating */}

                            <div className="space-y-2">
                                <Label htmlFor="isVisible">Available</Label>
                                <Controller
                                    control={control}
                                    name="isVisible"
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            onValueChange={(val: string) => onChange(val === "true")}
                                            value={value ? "true" : "false"}
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
                                {errors.isVisible && (
                                    <p className="text-sm text-red-500">{errors.isVisible.message}</p>
                                )}
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
                                {isSubmitting ? "Submitting..." : "Update City"}
                            </Button>
                        </div>
                    </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default UpdateModal
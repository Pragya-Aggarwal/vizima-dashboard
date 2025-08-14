import { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { propertySchema, PropertyFormData } from "../Schema/property-schema"
import { useState } from "react"
import { uploadToCloudinary, deleteImage } from "@/lib/utils/uploadToCloudinary"
import { toast } from "sonner"
import { useRef } from "react"
import { getPropertyById } from "@/src/services/propertyService"


type AddPropertyModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: PropertyFormData, onSuccess: () => void) => void
    propertyId: string | null | undefined;

    setPropertyId: React.Dispatch<React.SetStateAction<string | null | undefined>>;

}

const UpdatePropertyModal = ({ open, setOpen, onSubmit, propertyId, setPropertyId }: AddPropertyModalProps) => {
    const {
        register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset, trigger
    } = useForm<PropertyFormData>({
        resolver: zodResolver(propertySchema),

        defaultValues: {
            name: "",
            type: "",
            city: "",
            area: "",
            rooms: 0,
            price: 0,
            deposit: 0,
            description: "",
            microSiteLink: "",
            featured: false,
            amenities: [],
            bulkAccommodation: false,
            bulkAccommodationType: [],
            sharingType: [],
            rules: [],
            nearbyPlaces: [], 
            images: [],
            isAvailable: false,  
            isFeatured: false,
            phone: "",
            gender: ""
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearbyPlaces",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const formatPhoneNumber = (phone: string): string => {
        // Remove any non-digit characters and trim
        const cleaned = phone.replace(/\D/g, '').trim();
        // If number doesn't start with +, add +91
        return cleaned.startsWith('+91') ? cleaned : cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
      };
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        
        // Save files for later upload
        setFilesToUpload(prev => [...prev, ...files]);
        
        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        
        // Reset the file input
        if (e.target) {
          e.target.value = '';
        }
      };
      const onFormSubmit = async (data: PropertyFormData) => {
        try {
          // Upload all files first
          const uploadedImageUrls = [];
          
          for (const file of filesToUpload) {
            try {
              const url = await uploadToCloudinary(file);
              uploadedImageUrls.push(url);
            } catch (error) {
              console.error('Error uploading file:', error);
              // Continue with other files even if one fails
            }
          }
          
          // Combine existing images with newly uploaded ones
          const allImages = [...(data.images || []), ...uploadedImageUrls];
          
          // Format phone number and include all images
          const formattedData = {
            ...data,
            phone: data.phone ? formatPhoneNumber(data.phone) : '',
            images: allImages
          };
          
          await onSubmit(formattedData as PropertyFormData, () => {
            // Reset form and state on success
            setFilesToUpload([]);
            setPreviewUrls([]);
            reset({
              name: "",
              type: "",
              phone: "",
              city: "",
              area: "",
              microSiteLink: "",
              rooms: 0,
              price: 0,
              deposit: 0,
              description: "",
              featured: false,
              amenities: [],
              bulkAccommodationType: [],
              sharingType: [],
              rules: [],
              nearbyPlaces: [], 
    
    
              images: [],
              isAvailable: false,  
              isFeatured: false,
            });
            setOpen(false);
            setPropertyId(null);
          });
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };



    useEffect(() => {
        const fetchPropertyData = async () => {
            if (propertyId && open) {
                try {
                    const response = await getPropertyById(propertyId);
                    const propertyData = response?.data?.property;if (propertyData) {
                        // ✅ Fill form with the fetched data
                        reset({
                            title: propertyData.title || "",
                            type: propertyData.type || "",
                            area: propertyData.area || "",
                            bathrooms: propertyData.bathrooms || 0,
                            bedrooms: propertyData.bedrooms || 0,
                            price: propertyData.price || 0,
                            deposit: propertyData.deposit || 0,
                            description: propertyData.description || "",
                            microSiteLink: propertyData.microSiteLink || "",
                            featured: propertyData.featured || false,
                            amenities: propertyData.amenities || [],
                            bulkAccommodationType: propertyData.bulkAccommodationType || [],
                            bulkAccommodation: Boolean(propertyData.bulkAccommodation),
                            sharingType: propertyData.sharingType || [],
                            rules: propertyData.rules || [],
                            nearbyPlaces: propertyData.nearbyPlaces || [],
                            images: propertyData.images || [],
                            isAvailable: propertyData.isAvailable || false,
                            isFeatured: propertyData.isFeatured || false,
                            gender: propertyData.gender || "",
                            phone: propertyData.phone || "",


                            location: {
                                address: propertyData.location?.address || "",
                                city: propertyData.location?.city || "",
                                state: propertyData.location?.state || "",
                                zipCode: propertyData.location?.zipCode || "",
                                coordinates: {
                                    lat: propertyData.location?.coordinates?.lat || 0,
                                    lng: propertyData.location?.coordinates?.lng || 0,
                                },
                            },
                        });
                    }
                } catch (error) {
                    console.error("Error fetching property details:", error);
                }
            }
        };

        fetchPropertyData();
    }, [propertyId, open, reset]);



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Property</DialogTitle>
                    <DialogDescription>Update Existing Property</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">

                        {/* Title & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Property Title</Label>
                                <Input id="title" {...register("title")} placeholder="Enter title" />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Property Type</Label>
                                <Controller
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="apartment">Apartment</SelectItem>
                                                <SelectItem value="house">House</SelectItem>
                                                <SelectItem value="room">Room</SelectItem>
                                                <SelectItem value="studio">Studio</SelectItem>
                                                <SelectItem value="villa">Villa</SelectItem>
                                                <SelectItem value="penthouse">PentHouse</SelectItem>
                                                <SelectItem value="pg">PG</SelectItem>
                                                <SelectItem value="hostel">Hostel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Contact Phone</Label>
                            <Input id="phone" {...register("phone")} placeholder="Enter contact phone number" />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                        </div>
                        {/* gender */}
                        <div className="space-y-2">
                            <Label htmlFor="bulkAccommodation">Bulk Accommodation</Label>
                            <Controller
                                control={control}
                                name="bulkAccommodation"
                                defaultValue={false}
                                render={({ field }) => {
                                    // Ensure value is a boolean
                                    const value = Boolean(field.value);
                                    return (
                                        <Select
                                            onValueChange={(val) => {
                                                // Convert string to boolean
                                                field.onChange(val === 'true');
                                            }}
                                            value={value ? 'true' : 'false'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Bulk Accommodation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Allowed</SelectItem>
                                                <SelectItem value="false">Not Allowed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    );
                                }}
                            />
                            {errors.bulkAccommodation && (
                                <p className="text-sm text-red-500">{errors.bulkAccommodation.message}</p>
                            )}
                        </div>




                        {/* bulk accomodation */}

                        {/* sharing type */}


                        <Controller
                            control={control}
                            name="sharingType"
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <Label>Sharing Type</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["single", "double", "triple"].map((type) => {
                                            const isChecked = field.value?.includes(type);
                                            return (
                                                <div key={type} className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            const updated = checked
                                                                ? [...(field.value || []), type]
                                                                : (field.value || []).filter((v) => v !== type);
                                                            field.onChange(updated);
                                                        }}
                                                    />
                                                    <Label className="capitalize">{type}</Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.sharingType && (
                                        <p className="text-sm text-red-500">
                                            {errors.sharingType.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="gender">Select Gender</Label>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field: { value, onChange, ...field } }) => {
                                    console.log('Current gender value:', value);
                                    return (
                                        <Select 
                                            onValueChange={onChange} 
                                            value={value || undefined}
                                            {...field}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="transgender">Transgender</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    );
                                }}
                            />
                            {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                        </div>





                        {/* end gender */}

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register("description")} placeholder="Enter description" rows={3} />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="microSiteLink">Microsite Link</Label>
                            <Input id="microSiteLink" {...register("microSiteLink")} placeholder="Enter microsite link" />
                            {errors.microSiteLink && <p className="text-sm text-red-500">{errors.microSiteLink.message}</p>}
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location.address">Address</Label>
                                <Input id="location.address" {...register("location.address")} placeholder="123 Main Street" />
                                {errors.location?.address && <p className="text-sm text-red-500">{errors.location.address.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location.city">City</Label>
                                <Input id="location.city" {...register("location.city")} placeholder="New York" />
                                {errors.location?.city && <p className="text-sm text-red-500">{errors.location.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location.state">State</Label>
                                <Input id="location.state" {...register("location.state")} placeholder="NY" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location.zipCode">Zip Code</Label>
                                <Input id="location.zipCode" {...register("location.zipCode")} placeholder="10001" />
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location.coordinates.lat">Latitude</Label>
                                <Input type="number" step="any" {...register("location.coordinates.lat", { valueAsNumber: true })} placeholder="40.7128" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location.coordinates.lng">Longitude</Label>
                                <Input type="number" step="any" {...register("location.coordinates.lng", { valueAsNumber: true })} placeholder="-74.0060" />
                            </div>
                        </div>

                        {/* Price, Bedrooms, Bathrooms, Area */}
                        <div className="grid grid-cols-4 gap-4">
                            <Input {...register("price", { valueAsNumber: true })} placeholder="Price" type="number" />
                            <Input {...register("bedrooms", { valueAsNumber: true })} placeholder="Bedrooms" type="number" />
                            <Input {...register("bathrooms", { valueAsNumber: true })} placeholder="Bathrooms" type="number" />
                            <Input {...register("area", { valueAsNumber: true })} placeholder="Area (sqft)" type="number" />
                        </div>


                        {/* bulk accomodation */}
                        {/* ameties copies */}


                        <div className="space-y-4">
                            <Label>Bulk Accomodation</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {["interns", "employees", "students", "managed accommodation"].map((item) => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <Controller
                                            control={control}
                                            name="bulkAccommodationType"
                                            render={({ field }) => {
                                                const apiValue = item === "managed accommodation" ? "managed_accommodation" : item;
                                                const isChecked = field.value?.includes(apiValue);
                                                return (
                                                    <>
                                                        <Switch
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                const newValue = checked
                                                                    ? [...(field.value || []), apiValue]
                                                                    : (field.value || []).filter((v) => v !== apiValue);
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <Label>{item}</Label>
                                                    </>
                                                );
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            {errors.bulkAccommodationType && <p className="text-sm text-red-500">{errors.bulkAccommodationType.message}</p>}
                        </div>




                        {/* bulk accomodation */}


                        {/* rules */}

                        <Controller
                            control={control}
                            name="rules"
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <Label>Rules</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["No smoking", "No pets", "No parties"].map((rule) => {
                                            const isChecked = field.value?.includes(rule);
                                            return (
                                                <div key={rule} className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            const updatedRules = checked
                                                                ? [...(field.value || []), rule]
                                                                : (field.value || []).filter((v) => v !== rule);
                                                            field.onChange(updatedRules);
                                                        }}
                                                    />
                                                    <Label>{rule}</Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.rules && (
                                        <p className="text-sm text-red-500">{errors.rules.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        {/*  */}

                        {/* Amenities */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Amenities</Label>
                                <div className="flex items-center space-x-2">
                                    <Controller
                                        control={control}
                                        name="amenities"
                                        render={({ field }) => {
                                            const allAmenities = ["wifi", "parking", "gym", "pool", "laundry", "ac", "heating", "kitchen", "balcony", "garden", "security", "elevator", "pets", "furnished", "tv", "dishwasher", "microwave", "refrigerator"];
                                            const allSelected = allAmenities.every(item => field.value?.includes(item));
                                            return (
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={allSelected}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked ? [...allAmenities] : []);
                                                        }}
                                                    />
                                                    <Label className="text-sm text-muted-foreground">Select All</Label>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {["wifi", "parking", "gym", "pool", "laundry", "ac", "heating", "kitchen", "balcony", "garden", "security", "elevator", "pets", "furnished", "tv", "dishwasher", "microwave", "refrigerator"].map((item) => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <Controller
                                            control={control}
                                            name="amenities"
                                            render={({ field }) => {
                                                const isChecked = field.value?.includes(item);
                                                return (
                                                    <>
                                                        <Switch
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                const newValue = checked
                                                                    ? [...(field.value || []), item]
                                                                    : (field.value || []).filter((v) => v !== item);
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <Label>{item}</Label>
                                                    </>
                                                );
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            {errors.amenities && <p className="text-sm text-red-500">{errors.amenities.message}</p>}
                        </div>

                        {/* isAvailable + isFeatured */}
                        <div className="flex items-center gap-6">
                            <Controller
                                name="isAvailable"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Switch
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label>Is Available</Label>
                                    </>
                                )}
                            />

                            <Controller
                                name="isFeatured"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Switch
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label>Is Featured</Label>
                                    </>
                                )}
                            />
                        </div>



                        {/* near by plece */}

                        <div className="space-y-4">
                            <Label>Nearby Places</Label>

                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-3 gap-4 items-start">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            {...register(`nearbyPlaces.${index}.name`)}
                                            placeholder="e.g. Central Hospital"
                                        />
                                        {errors.nearbyPlaces?.[index]?.name && (
                                            <p className="text-sm text-red-500">
                                                {errors.nearbyPlaces[index]?.name?.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Distance</Label>
                                        <Input
                                            {...register(`nearbyPlaces.${index}.distance`)}
                                            placeholder="e.g. 0.5 km"
                                        />
                                        {errors.nearbyPlaces?.[index]?.distance && (
                                            <p className="text-sm text-red-500">
                                                {errors.nearbyPlaces[index]?.distance?.message}
                                            </p>
                                        )}
                                    </div>
                                    <Controller
                                        control={control}
                                        name={`nearbyPlaces.${index}.type`}
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                <Label>Type</Label>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="hospital">Hospital</SelectItem>
                                                        <SelectItem value="school">School</SelectItem>
                                                        <SelectItem value="mall">Mall</SelectItem>
                                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                                        <SelectItem value="transport">Transport</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>


                                                    </SelectContent>
                                                </Select>
                                                {errors.nearbyPlaces?.[index]?.type && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.nearbyPlaces[index]?.type?.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => remove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                onClick={() =>
                                    append({ name: "", distance: "", type: "" })
                                }
                            >
                                Add Nearby Place
                            </Button>
                        </div>

                        <Controller
                            control={control}
                            name="images"
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <div
                                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                        >
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Drag & drop images or click to browse
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
                                                    Upload Images
                                                </Button>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            ref={fileInputRef}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={async (e) => {
                                                e.stopPropagation();
                                                if (handleFileChange) {
                                                    await handleFileChange(e);
                                                    if (e.target) {
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Show uploaded images preview */}
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {/* Show existing images */}
                                        {(field.value || []).map((url, idx) => (
                                            <div key={`existing-${idx}`} className="relative">
                                                <img src={url} alt={`existing-${idx}`} className="w-full h-24 object-cover rounded" />
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute top-1 right-1 w-6 h-6"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            const fileName = url.split('/').pop();
                                                            if (fileName) {
                                                                await deleteImage(fileName);
                                                                const updatedImages = field.value?.filter((_, i) => i !== idx) || [];
                                                                field.onChange(updatedImages);
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
                                        ))}
                                        
                                        {/* Show new image previews */}
                                        {previewUrls.map((url, idx) => (
                                            <div key={`preview-${idx}`} className="relative">
                                                <img src={url} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded" />
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute top-1 right-1 w-6 h-6"
                                                    onClick={() => {
                                                        // Remove from preview URLs and files to upload
                                                        const newPreviewUrls = [...previewUrls];
                                                        newPreviewUrls.splice(idx, 1);
                                                        setPreviewUrls(newPreviewUrls);
                                                        
                                                        const newFiles = [...filesToUpload];
                                                        newFiles.splice(idx, 1);
                                                        setFilesToUpload(newFiles);
                                                        
                                                        toast.success("Image removed from upload queue");
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.images && (
                                        <p className="text-sm text-red-500">{errors.images.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        {/* end near by plase */}

                        {/* Submit */}
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Update Property"}
                            </Button>
                        </div>
                    </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default UpdatePropertyModal
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
import { propertySchema, PropertyFormData } from "../Schema/property-schema"
import { useState } from "react"
import { uploadToCloudinary, deleteImage } from "@/lib/utils/uploadToCloudinary"
import { useRef } from "react"

type AddPropertyModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (data: PropertyFormData, onSuccess: () => void) => void
}

const AddPropertyModal = ({ open, setOpen, onSubmit }: AddPropertyModalProps) => {
  const {
    register, 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setValue, 
    watch, 
    reset, 
    trigger,
    formState: { isSubmitSuccessful }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),



    defaultValues: {
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
      nearbyPlaces: [], // ✅ must be array of objects



      images: [],
      isAvailable: true,  // ✅ very important
      isFeatured: false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nearbyPlaces",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters and trim
    const cleaned = phone.replace(/\D/g, '').trim();
    // If number doesn't start with +, add +91
    return cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    try {
      // Format phone number before submission
      const formattedData = {
        ...data,
        phone: data.phone ? formatPhoneNumber(data.phone) : ''
      };
      await onSubmit(formattedData as PropertyFormData, () => {
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
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when dialog is closed via outside click or cancel
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
        isAvailable: true,
        isFeatured: false,
      });
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>Create a new PG or Hostel listing</DialogDescription>
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <Input 
                  id="phone" 
                  {...register("phone")} 
                  placeholder="Enter contact phone number" 
                  type="tel"
                  className="pl-10"
                />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* gender */}
            <div className="space-y-2">
              <Label htmlFor="bulkAccommodation">Bulk Accommodation</Label>
              <Controller
                control={control}
                name="bulkAccommodation"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bulk Accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Allowed</SelectItem>
                      <SelectItem value="false">Not Allowed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
              <Label htmlFor="type">Select Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="transgender">Transgender</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>

                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
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
                {["interns", "employees", "students", "Managed Accomodation"].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="bulkAccommodationType"
                      render={({ field }) => {
                        const apiValue = item === "Managed Accomodation" ? "managed_accommodation" : item;
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
                {["wifi", "parking", "gym", "pool", "laundry", "ac", "heating", "kitchen", "balcony", "garden", "security", "elevator", "pets", "furnished", "tv", "dishwasher", "microwave", "refrigerator",].map((item) => (
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
                  <Label>Property Images</Label>

                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
                    onClick={(e) => {
                      e.preventDefault();
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={async (e) => {
                        e.stopPropagation();
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadToCloudinary(file);
                          field.onChange([...(field.value || []), url]);
                        } catch (err) {
                          console.error("Upload failed:", err);
                        } finally {
                          // Reset the file input to allow selecting the same file again
                          if (e.target) {
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Show uploaded images preview */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {(field.value || []).map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`uploaded-${idx}`} className="w-full h-24 object-cover rounded" />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 w-6 h-6"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              // const fileName = url.split('//').pop();
                              console.log(url);
                              if (url) {
                                await deleteImage(url);
                                const updated = field.value.filter((_, i) => i !== idx);
                                field.onChange(updated);
                              }
                            } catch (error) {
                              console.error('Failed to delete image:', error);
                            }
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
                {isSubmitting ? "Submitting..." : "Create Property"}
              </Button>
            </div>
          </form>





        </div>
      </DialogContent >
    </Dialog >
  )


}


export default AddPropertyModal
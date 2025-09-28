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

import { useForm, Controller, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { propertySchema, PropertyFormData } from "../Schema/property-schema"
import { useState } from "react"
import { uploadToCloudinary, deleteImage } from "@/lib/utils/uploadToCloudinary"
import { useRef } from "react"

type SharingType = {
  type: string;
  price: number;
  description?: string;
};

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
      price: 0,
      microSiteLink: "",
      youtubeLink: "",    
      rooms: 0,
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

  const onFormSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    try {
      // Format phone number before submission
      const formattedData = {
        ...data,
        phone: data.phone ? formatPhoneNumber(data.phone) : ''
      } as PropertyFormData;
      await onSubmit(formattedData, () => {
        reset({
          name: "",
          type: "",
          phone: "",
          city: "",
          area: "",
          microSiteLink: "",
          youtubeLink: "",    
          rooms: 0,
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
        youtubeLink: "",    
        rooms: 0,
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

            {/* Amenities */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Amenities</Label>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="amenities"
                    render={({ field }) => {
                      const amenityOptions = [
                        { id: 'wifi', label: 'WiFi' },
                        { id: 'parking', label: 'Parking' },
                        { id: 'gym', label: 'Gym' },
                        { id: 'daily_cleaning', label: 'Daily Cleaning' },
                        { id: 'laundry', label: 'Laundry' },
                        { id: 'ac', label: 'Air Conditioning' },
                        { id: 'heating', label: 'Heating' },
                        { id: 'kitchen', label: 'Kitchen' },
                        { id: 'balcony', label: 'Balcony' },
                        { id: 'garden', label: 'Garden' },
                        { id: 'security', label: 'Security' },
                        { id: 'elevator', label: 'Elevator' },
                        { id: 'power_backup', label: 'Power Backup' },
                        { id: 'furnished', label: 'Furnished' },
                        { id: 'tv', label: 'TV' },
                        { id: 'transportation', label: 'Transportation' },
                        { id: 'microwave', label: 'Microwave' },
                        { id: 'refrigerator', label: 'Refrigerator' }
                      ];
                      
                      const allSelected = amenityOptions.every(opt => field.value?.includes(opt.id));
                      
                      return (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={allSelected}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? amenityOptions.map(opt => opt.id) : []);
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
                <Controller
                  control={control}
                  name="amenities"
                  render={({ field }) => (
                    <>
                      {[
                        { id: 'wifi', label: 'WiFi' },
                        { id: 'parking', label: 'Parking' },
                        { id: 'gym', label: 'Gym' },
                        { id: 'daily_cleaning', label: 'Daily Cleaning' },
                        { id: 'laundry', label: 'Laundry' },
                        { id: 'ac', label: 'Air Conditioning' },
                        { id: 'heating', label: 'Heating' },
                        { id: 'kitchen', label: 'Kitchen' },
                        { id: 'balcony', label: 'Balcony' },
                        { id: 'garden', label: 'Garden' },
                        { id: 'security', label: 'Security' },
                        { id: 'elevator', label: 'Elevator' },
                        { id: 'power_backup', label: 'Power Backup' },
                        { id: 'furnished', label: 'Furnished' },
                        { id: 'tv', label: 'TV' },
                        { id: 'transportation', label: 'Transportation' },
                        { id: 'microwave', label: 'Microwave' },
                        { id: 'refrigerator', label: 'Refrigerator' }
                      ].map(({ id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                          <Switch
                            checked={field.value?.includes(id) || false}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), id]
                                : (field.value || []).filter((v: string) => v !== id);
                              field.onChange(newValue);
                            }}
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.amenities && <p className="text-sm text-red-500">{String(errors.amenities.message || '')}</p>}
            </div>

            {/* Room Type Selection */}
            <div className="space-y-4">
              <Label>Select Room Types</Label>
              <div className="space-y-4 p-3 border rounded-md bg-muted/30">
                {["single", "double", "triple", "quadruple"].map((type) => {
                  const currentSharingTypes: SharingType[] = watch('sharingType') || [];
                  const currentType = currentSharingTypes.find(st => st.type === type);
                  const isSelected = !!currentType;
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="capitalize font-medium w-16">
                          {type === 'single' ? 'Single' : type === 'double' ? 'Double' : type === 'triple' ? 'Triple' : 'Quad'}
                        </span>
                        <Switch
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const currentTypes: SharingType[] = watch('sharingType') || [];
                            const updated = checked
                              ? [...currentTypes, { type, price: 0, description: '' }]
                              : currentTypes.filter(st => st.type !== type);
                            setValue('sharingType', updated, { shouldValidate: true });
                          }}
                        />
                      </div>
                      {isSelected && (
                        <div className="pl-8">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor={`${type}-price`}>Price</Label>
                                <Input
                                  id={`${type}-price`}
                                  type="number"
                                  min="0"
                                  value={currentType?.price || 0}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    const updated = (watch('sharingType') || []).map(st => 
                                      st.type === type ? { ...st, price: value } : st
                                    );
                                    setValue('sharingType', updated, { shouldValidate: true });
                                  }}
                                  placeholder="Enter price"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`${type}-description`}>Description</Label>
                              <Textarea
                                id={`${type}-description`}
                                value={currentType?.description || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updated = (watch('sharingType') || []).map(st => 
                                    st.type === type ? { ...st, description: value } : st
                                  );
                                  setValue('sharingType', updated, { shouldValidate: true });
                                }}
                                placeholder={`Enter description for ${type} room`}
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Room Pricing - Only show if at least one room type is selected */}
              {(watch('sharingType') || []).length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Room Pricing</Label>
                    {errors.sharingType && (
                      <p className="text-sm text-red-500">
                        {Array.isArray(errors.sharingType) 
                          ? errors.sharingType[0]?.message 
                          : String(errors.sharingType?.message || '')}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border rounded-md">
                    {["single", "double", "triple", "quadruple"].map((type) => {
                      const currentSharingTypes: SharingType[] = watch('sharingType') || [];
                      const roomType = currentSharingTypes.find(st => st.type === type);
                      
                      return roomType ? (
                        <div key={type} className="space-y-1">
                          <Label className="text-sm text-muted-foreground">
                            {type === 'single' ? 'Single' : type === 'double' ? 'Double' : type === 'triple' ? 'Triple' : 'Quad'} Price
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                            <Input
                              type="number"
                              placeholder="0"
                              value={roomType.price.toString()}
                              onChange={(e) => {
                                const currentTypes: SharingType[] = watch('sharingType') || [];
                                const price = e.target.value === '' ? 0 : Number(e.target.value);
                                const updated = currentTypes.map(st => 
                                  st.type === type ? { ...st, price: Math.max(0, price) } : st
                                );
                                setValue('sharingType', updated, { shouldValidate: true });
                              }}
                              min="0"
                              step="100"
                              className="pl-8"
                            />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  {errors.sharingType && (
                    <p className="text-sm text-red-500">
                      {String(errors.sharingType.message || '')}
                    </p>
                  )}
                </div>
              )}
            </div>

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
                      <SelectItem value="unisex">Co-Living</SelectItem>
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

            <div className="space-y-2">
              <Label htmlFor="youtubeLink">Youtube Link</Label>
              <Input id="youtubeLink" {...register("youtubeLink")} placeholder="Enter youtube link" />
              {errors.youtubeLink && <p className="text-sm text-red-500">{errors.youtubeLink.message}</p>}
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
              {/* <Input {...register("price", { valueAsNumber: true })} placeholder="Price" type="number" /> */}
              {/* <Input {...register("bedrooms", { valueAsNumber: true })} placeholder="Bedrooms" type="number" />
              <Input {...register("bathrooms", { valueAsNumber: true })} placeholder="Bathrooms" type="number" /> */}
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
                    {["No smoking", "No  Power back-up", "No parties"].map((rule) => {
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
                      multiple
                      className="hidden"
                      ref={fileInputRef}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={async (e) => {
                        e.stopPropagation();
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        
                        try {
                          const uploadPromises = files.map(file => uploadToCloudinary(file));
                          const urls = await Promise.all(uploadPromises);
                          field.onChange([...(field.value || []), ...urls]);
                        } catch (err) {
                          console.error("Upload failed:", err);
                        } finally {
                          // Reset the file input to allow selecting the same files again
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
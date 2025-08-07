"use client"
import { useState, useCallback } from "react"
import { useQueryClient } from '@tanstack/react-query';
import api from "../../../lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { deleteMultipleProperties, deletePropertybyId } from "@/src/services/propertyService"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import { updatePropertyById } from "@/src/services/propertyService"


import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

import {
    Plus,
    Download,
    Filter,
    RefreshCw,
    Eye,
    Edit,
    Trash2,
    Star,
    MapPin,
    Settings,
    FolderSyncIcon as Sync,
    CheckCircle,
    Clock,
    AlertCircle,
    Upload,
    ImageIcon,
    Trash
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FC } from "react";
import { boolean } from "zod"
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import UpdatePropertyModal from "../UpdatePropertyModal/UpdatePropertyModal"
import { PropertyFormData } from "../Schema/property-schema"

// type Property = {
//     _id: string;
//     title: string;
//     price: number;
//     images: string[];
//     bedrooms: number;
//     location: {
//         address: string;
//         city: string;
//         state?: string;
//     };
//     type: string;
//     isAvailable: boolean;
//     isFeatured: boolean;
// };


type Property = {
    _id: string;
    title: string;
    price: number;
    images: string[];
    bedrooms: number;
    location: {
        address: string;
        city: string;
        state?: string;
    };
    type: string;
    isAvailable: boolean;
    isFeatured: boolean;
    occupancy: number;
    revenue?: number;
    status?: "verified" | "unverified" | string;
    rating?: {
        average?: number;
    };


};

// type PropertyListProps = {
//     properties: Property[];
//     search: string;
//     setSearch: React.Dispatch<React.SetStateAction<string>>;
//     type: string;
//     setType: React.Dispatch<React.SetStateAction<string>>;
//     sharingType: string;
//     setsharingType: React.Dispatch<React.SetStateAction<string>>
//     isLoading: string;
//     bedrooms: number;
//     setBedrooms: React.Dispatch<React.SetStateAction<string>>
//     bathrooms: number;
//     setBathrooms: React.Dispatch<React.SetStateAction<string>>;
//     isAvailable: boolean;
//     setIsAvailable: React.Dispatch<React.SetStateAction<string>>;
//     isFeatured: boolean;
//     setIsFeatured: React.Dispatch<React.SetStateAction<string>>;
//     isFeaturedTouched: boolean;
//     setIsFeaturedTouched: React.Dispatch<React.SetStateAction<string>>
//     isAvailableTouched: boolean;
//     setIsAvailableTouched: React.Dispatch<React.SetStateAction<string>>
//     sortOrder: string;
//     setSortOrder: React.Dispatch<React.SetStateAction<string>>
//     sortBy: string;
//     setSortBy: React.Dispatch<React.SetStateAction<string>>;
//     city: string;
//     setCity: React.Dispatch<React.SetStateAction<string>>;
//     state: string;
//     setState: React.Dispatch<React.SetStateAction<string>>;
//     // ✅ Add missing amenities props
//     selectedAmenities: string[];
//     setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
// };


type PropertyListProps = {
    properties: Property[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    sharingType: string;
    setsharingType: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    bedrooms: number;
    setBedrooms: React.Dispatch<React.SetStateAction<number>>;
    bathrooms: number;
    setBathrooms: React.Dispatch<React.SetStateAction<number>>;
    isAvailable: boolean;
    setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    isFeatured: boolean;
    setIsFeatured: React.Dispatch<React.SetStateAction<boolean>>;
    isAvailableTouched: boolean;
    setIsAvailableTouched: React.Dispatch<React.SetStateAction<boolean>>;
    isFeaturedTouched: boolean;
    setIsFeaturedTouched: React.Dispatch<React.SetStateAction<boolean>>;
    sortOrder: "asc" | "desc";
    setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    city: string;
    setCity: React.Dispatch<React.SetStateAction<string>>;
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
    selectedAmenities: string[];
    setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    refetch: () => void;
};

const PropertyList: FC<PropertyListProps> = ({ properties, search, setSearch, type, setType, sharingType, setsharingType, isLoading, bathrooms, setBathrooms, bedrooms, setBedrooms, isAvailable, setIsAvailable, isFeatured, setIsFeatured, isAvailableTouched, setIsAvailableTouched, isFeaturedTouched, setIsFeaturedTouched, sortOrder, setSortOrder, sortBy, refetch, setSortBy, city, setCity, state, setState, selectedAmenities, setSelectedAmenities, currentPage, setCurrentPage, totalPages }) => {

    const queryClient = useQueryClient();
    const [selectedTab, setSelectedTab] = useState("vizima")
    const [open, setOpen] = useState(false)
    const [propertyId, setPropertyId] = useState<string | null | undefined>();
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination handlers
    const goToFirstPage = useCallback((): void => {
        setCurrentPage(1);
    }, [setCurrentPage]);

    const goToLastPage = useCallback((): void => {
        setCurrentPage(totalPages);
    }, [setCurrentPage, totalPages]);

    const goToNextPage = useCallback((): void => {
        setCurrentPage((prev: number) => Math.min(totalPages, prev + 1));
    }, [setCurrentPage, totalPages]);

    const goToPrevPage = useCallback((): void => {
        setCurrentPage((prev: number) => Math.max(1, prev - 1));
    }, [setCurrentPage]);

    const handleUpdateProperty = async (
        data: PropertyFormData,
        onSuccess: () => void
    ) => {
        try {
            if (!propertyId) {
                toast.error("Property ID is missing");
                return;
            }
            const res = await updatePropertyById(propertyId, data)
            toast.success("Property updated successfully.");

            // Invalidate and refetch properties query
            await queryClient.invalidateQueries({ queryKey: ['properties'] });

            onSuccess();
            setOpen(false);
        } catch (error: any) {
            console.error("Error adding property:", error);
            toast.error(error?.response?.data?.message || "Failed to add property");
        }
    };

    const rentokProperties = [
        {
            id: "RO001",
            name: "Metro Heights PG",
            city: "Bangalore",
            area: "Whitefield",
            lastSync: "2024-01-14 10:30 AM",
            status: "synced",
            overrides: ["Pricing", "Images"],
            rooms: 22,
            price: 11000,
        },
        {
            id: "RO002",
            name: "Tech Park Hostel",
            city: "Hyderabad",
            area: "Gachibowli",
            lastSync: "2024-01-13 08:15 PM",
            status: "pending",
            overrides: ["Description"],
            rooms: 15,
            price: 9500,
        },
    ]

    const handleClearFilters = () => {
        setCity("");
        setState("");
        setSelectedAmenities([]);
        setType("all");
        setsharingType("all");
        setBedrooms(0); // Assuming 0 = not filtered
        setBathrooms(0); // Assuming 0 = not filtered
        setIsAvailable(false);
        setIsAvailableTouched(false);
        setIsFeatured(false);
        setIsFeaturedTouched(false);
        setSortBy("");
        setSortOrder("desc");
        setSearch("");
    };


    const router = useRouter();

    const handleView = (id: string) => {
        router.push(`/dashboard/property/${id}`);
    };

    const handleUpdatePropertModalOpen = async (id: string) => {
        setOpen(true);
        setPropertyId(id);
    };
    const handleRefresh = () => {
        refetch();
        setSelectedProperties([]);
    };

    const handleSelectProperty = (propertyId: string) => {
        setSelectedProperties(prev =>
            prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    const handleSelectAllProperties = () => {
        if (selectedProperties.length === properties.length) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(properties.map(property => property._id));
        }
    };

    const handleDeleteMultiple = async () => {
        if (selectedProperties.length === 0) return;

        try {
            setIsDeleting(true);
            const response = await deleteMultipleProperties(selectedProperties);

            if (response.success) {
                toast.success(`${selectedProperties.length} properties deleted successfully`);
                setSelectedProperties([]);
                refetch();
            }
        } catch (error: any) {
            console.error('Error deleting properties:', error);
            toast.error(error.response?.data?.message || 'Failed to delete properties');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className=" mt-5 mx-5">

            {/* <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList>
                    <TabsTrigger value="vizima">
                        Total Property
                    </TabsTrigger> */}
            {/* <TabsTrigger value="rentok">RentOk Sync by ({rentokProperties.length})</TabsTrigger> */}
            {/* </TabsList>

                <TabsContent value="vizima" className="space-y-4"> */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Vizima Properties</CardTitle>
                        <div className="flex space-x-2">
                            <div className="relative">
                                <Input
                                    placeholder="Search properties..."
                                    className="w-64"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="search"
                                />
                            </div>
                            {/* dialog box */}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg sm:text-xl">Filter Properties</DialogTitle>
                                        <DialogDescription className="text-sm">Apply filters to narrow down properties.</DialogDescription>
                                    </DialogHeader>

                                    {/* City & State */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Search By City</Label>
                                            <Input
                                                placeholder="Search cities.."
                                                className="w-full text-sm rounded-md"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                type="search"
                                            />
                                        </div>
                                        <div>
                                            <Label>Search By State</Label>
                                            <Input
                                                placeholder="Search state.."
                                                className="w-full text-sm rounded-md"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                type="search"
                                            />
                                        </div>
                                    </div>

                                    {/* Amenities (Checkbox) */}
                                    <div className="mt-4">
                                        <Label>Select Amenities</Label>
                                        <div className="flex gap-3 flex-wrap mt-2">
                                            {[
                                                "wifi", "parking", "gym", "pool", "laundry", "ac", "heating", "kitchen",
                                                "balcony", "garden", "security", "evevator", "pets", "furnished", "tv",
                                                "dishwasher", "microwave", "refrigerator"
                                            ].map((amenity) => (
                                                <label key={amenity} className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        value={amenity}
                                                        checked={selectedAmenities.includes(amenity)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedAmenities([...selectedAmenities, amenity]);
                                                            } else {
                                                                setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                                                            }
                                                        }}
                                                    />
                                                    {amenity}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Property Type & Sharing Type */}
                                    <div className="grid gap-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="type">Property Type:</Label>
                                            <Select value={type} onValueChange={(value) => setType(value)}>
                                                <SelectTrigger className="w-full sm:w-[180px] text-sm rounded-md">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="apartment">Apartment</SelectItem>
                                                    <SelectItem value="pg">PG</SelectItem>
                                                    <SelectItem value="hostel">Hostel</SelectItem>
                                                    <SelectItem value="villa">Villa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Sharing Type</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {["single", "double", "triple"].map((typeOption) => (
                                                    <Badge
                                                        key={typeOption}
                                                        variant={sharingType === typeOption ? "default" : "outline"}
                                                        onClick={() => setsharingType(typeOption)}
                                                        className="cursor-pointer"
                                                    >
                                                        {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                                                    </Badge>
                                                ))}
                                                <Badge
                                                    variant={sharingType === "all" ? "default" : "outline"}
                                                    onClick={() => setsharingType("all")}
                                                    className="cursor-pointer"
                                                >
                                                    All
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Bedrooms & Bathrooms */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Bedrooms</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 2"
                                                    value={bedrooms}
                                                    onChange={(e) => setBedrooms(Number(e.target.value))}
                                                    min={0}
                                                    className="text-sm rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <Label>Bathrooms</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 1"
                                                    value={bathrooms}
                                                    onChange={(e) => setBathrooms(Number(e.target.value))}
                                                    min={0}
                                                    className="text-sm rounded-md"
                                                />
                                            </div>
                                        </div>

                                        {/* Availability & Featured */}
                                        
                                        <div className="flex items-center justify-between">
                                            <Label>Featured</Label>
                                            <Switch
                                                checked={isFeatured}
                                                onCheckedChange={(checked) => {
                                                    setIsFeatured(checked);
                                                    setIsFeaturedTouched(true);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Sort By & Order */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Sort By</Label>
                                            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                                                <SelectTrigger className="w-full text-sm rounded-md">
                                                    <SelectValue placeholder="Select Field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="createdAt">Created At</SelectItem>
                                                    <SelectItem value="price">Price</SelectItem>
                                                    <SelectItem value="views">Views</SelectItem>
                                                    <SelectItem value="title">Title</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Sort Order</Label>
                                            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                                                <SelectTrigger className="w-full text-sm rounded-md">
                                                    <SelectValue placeholder="Select Order" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="asc">Ascending</SelectItem>
                                                    <SelectItem value="desc">Descending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Clear Button */}
                                    <div className="flex justify-end mt-4">
                                        <Button variant="outline" onClick={handleClearFilters} size="sm">
                                            Clear
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>




                            {/* end dialog box */}

                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleRefresh}
                                disabled={isDeleting}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            {selectedProperties.length > 0 && (
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={handleDeleteMultiple}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete ({selectedProperties.length})
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedProperties.length > 0 && selectedProperties.length === properties.length}
                                            onChange={handleSelectAllProperties}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Occupancy</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* with loading indicator */}
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                        <LoadingIndicator />
                                    </TableCell>
                                </TableRow>
                            ) : properties?.length > 0 ? (
                                properties.map((property, index) => (
                                    <TableRow key={property._id || index} className={selectedProperties.includes(property._id) ? 'bg-gray-50' : ''}>

                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={selectedProperties.includes(property._id)}
                                                    onChange={() => handleSelectProperty(property._id)}
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={property?.images?.[0] || "/placeholder.svg"} />
                                                    <AvatarFallback>{property?.title?.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{property?.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {property?.bedrooms || 0} rooms • ₹{property?.price?.toLocaleString()}/month
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {property?.isFeatured && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                                Featured
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline" className="text-xs">
                                                            {property?.images?.length || 0} images
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                                    {property?.location?.city}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{property?.location?.address}</p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline">{property?.type}</Badge>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Progress value={property?.occupancy || 0} className="w-16 h-2" />
                                                <span className="text-sm font-medium">{property?.occupancy || 0}%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {Math.round(((property?.occupancy || 0) / 100) * (property?.bedrooms || 0))}/{property?.bedrooms || 0} occupied
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-medium">₹{property?.revenue?.toLocaleString() || "0"}</div>
                                            <p className="text-xs text-muted-foreground">this month</p>
                                        </TableCell>


                                        <TableCell>
                                            <div className="flex space-x-1">

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(() => handleView(property._id))}
                                                    aria-label="View Property"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                <Button variant="ghost" size="sm" onClick={(() => handleUpdatePropertModalOpen(property._id))}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button
                                                            aria-label="Delete"
                                                            className="text-primary hover:text-red-800"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    </AlertDialogTrigger>

                                                    <AlertDialogContent className="max-w-md">
                                                        <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
                                                            <div className="p-4 border-2 border-dashed border-primary rounded-full">
                                                                <Trash size={40} className="text-primary" />
                                                            </div>

                                                            <AlertDialogTitle className="text-xl font-semibold text-primary">
                                                                Are you absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-gray-600">
                                                                This action cannot be undone. This will permanently delete the item
                                                                from the system.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>

                                                        <AlertDialogFooter className="flex justify-center gap-4 mt-4">
                                                            <AlertDialogCancel className="px-4 py-2 rounded border">
                                                                Cancel
                                                            </AlertDialogCancel>

                                                            <AlertDialogAction
                                                                onClick={async () => {
                                                                    try {
                                                                        await deletePropertybyId(property._id);
                                                                        toast.success("Property deleted successfully");

                                                                        // Invalidate and refetch properties query
                                                                        await queryClient.invalidateQueries({ queryKey: ['properties'] });

                                                                    } catch (err) {
                                                                        toast.error("Failed to delete property");
                                                                        console.error(err);
                                                                    }
                                                                }}
                                                                className="bg-primary text-white hover:bg-primary px-4 py-2 rounded"
                                                            >
                                                                Confirm Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                        No property found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>




                    </Table>
                </CardContent>
            </Card>
            {/* </TabsContent> */}

            {/* <TabsContent value="rentok" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>RentOk Integration</CardTitle>
                                <div className="flex space-x-2">
                                    <Button variant="outline">
                                        <Sync className="h-4 w-4 mr-2" />
                                        Sync All
                                    </Button>
                                    <Button>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Configure
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>Manage properties synced from RentOk platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium">Sync Status</p>
                                            <p className="text-sm text-muted-foreground">Last synced: 2 hours ago • Next sync: in 4 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Sync Now
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Schedule
                                        </Button>
                                    </div>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Property</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Last Sync</TableHead>
                                            <TableHead>Override Fields</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rentokProperties.map((property) => (
                                            <TableRow key={property.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback>{property.name.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{property.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {property.rooms} rooms • ₹{property.price.toLocaleString()}/month
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                                            {property.city}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{property.area}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{property.lastSync}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {property.overrides.map((override) => (
                                                            <Badge key={override} variant="outline" className="text-xs">
                                                                {override}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={property.status === "synced" ? "default" : "secondary"}>
                                                        {property.status === "synced" ? (
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                        )}
                                                        {property.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="sm">
                                                            <Sync className="h-4 w-4" />
                                                        </Button>

                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent> */}
            {/* </Tabs > */}

            <UpdatePropertyModal open={open} setOpen={setOpen} onSubmit={handleUpdateProperty} propertyId={propertyId} setPropertyId={setPropertyId} />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToFirstPage}
                            disabled={currentPage === 1}
                        >
                            First
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="px-2 text-sm">
                            {currentPage} / {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages}
                        >
                            Last
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PropertyList
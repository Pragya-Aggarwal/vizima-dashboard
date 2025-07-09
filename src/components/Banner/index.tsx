"use client"

import React, { useState, useCallback } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Components
import DetailModal from "./DetailModal/detailModal"
import { DeleteModal } from "@/src/common/DeleteModal/deleteModal"
import AddCityModal from "./AddNewCity/AddNewCity"
import UpdateModal from "./UpdateCity/updateCity"
import { BannerList } from "./BannerList"

// Types
import { SchemaFormData } from "./Schema/schema"

// Local Banner interface that matches the expected type in DetailModal
interface Banner {
    _id: string;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
    order: number;
    type: string;
    targetAudience: string;
    displayLocation: string[];
    startDate: string;
    endDate: string;
    link: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any; // Add index signature to allow additional properties
}

// Services
import { getBanners, addBanner, deleteBanner, updateBannerById } from "@/src/services/Banner"



// Add ErrorBoundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Error in Banner component:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please try again later.</div>;
        }
        return this.props.children;
    }
}

const BannerMain = () => {
    // State hooks - must be called at the top level and unconditionally
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [updateopen, setUpdateOpen] = useState(false);
    const [detailModalopen, setDetailModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [testimonialId, setTestimonialId] = useState<string | null | undefined>();
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const ITEMS_PER_PAGE = 10;

    // Define fetchBanners with useCallback
    const fetchBanners = useCallback(async () => {
        try {
            const payload = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            };
            const response = await getBanners(payload);
            return response;
        } catch (error) {
            console.error("Error fetching banners:", error);
            throw error;
        }
    }, [currentPage, ITEMS_PER_PAGE]);

    // Use the useQuery hook with proper error handling
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["allbanners", currentPage],
        queryFn: fetchBanners,
        retry: 1,
    });

    // Process the data
    const bannerData = data || { data: [], page: 1, total: 0 };
    const totalPages = data?.page || 1;
    const totalRecord = data?.total || 0;

    // Show loading state
    if (isLoading) {
        return <div>Loading banners...</div>;
    }

    // Show error state
    if (isError) {
        return (
            <div className="p-4 text-red-600">
                Error loading banners. Please try again later.
                <Button onClick={() => refetch()} className="ml-4">
                    Retry
                </Button>
            </div>
        );
    }


    // const handleAdd = async (
    //     data: SchemaFormData,
    //     onSuccess: () => void
    // ) => {
    //     try {
    //         const res = await addBanner(data)
    //         toast.success("City added successfully!");
    //         onSuccess();
    //         setOpen(false);
    //         refetch();
    //     } catch (error: any) {
    //         toast.error(error?.response?.data?.message || "Failed to add City");
    //     }
    // };


    const handleAdd = async (data: SchemaFormData) => {
        try {
            if (!selectedFile) {
                toast.error("Please select an image for the banner");
                return;
            }

            const formData = new FormData();
            // Add all required fields to formData
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('link', data.link);
            formData.append('isActive', String(data.isActive));
            formData.append('order', String(data.order));
            formData.append('type', data.type);
            formData.append('targetAudience', data.targetAudience);

            // Handle array fields
            if (Array.isArray(data.displayLocation)) {
                data.displayLocation.forEach((location: string) => {
                    formData.append('displayLocation', location);
                });
            }

            // Handle dates
            if (data.startDate) {
                formData.append('startDate', new Date(data.startDate).toISOString());
            }
            if (data.endDate) {
                formData.append('endDate', new Date(data.endDate).toISOString());
            }

            // Add the image file
            formData.append('image', selectedFile);

            await addBanner(formData);

            toast.success("Banner added successfully!");
            setOpen(false);
            setSelectedFile(null);
            refetch(); // Refresh the banner list
        } catch (error: any) {
            console.error("Error adding banner:", error);
            toast.error(error?.response?.data?.message || "Failed to add banner");
        }
    };



    // selectedBanner state is already declared at the top level

    const handleUpdateModalOpen = (id: string) => {
        const banner = bannerData?.data?.find((b: any) => b._id === id);
        if (banner) {
            // Ensure all required fields are present and properly typed
            const typedBanner: Banner = {
                _id: banner._id,
                title: banner.title || '',
                description: banner.description || '',
                image: banner.image || '',
                isActive: banner.isActive || false,
                order: banner.order || 0,
                type: banner.type || '',
                targetAudience: banner.targetAudience || '',
                displayLocation: Array.isArray(banner.displayLocation) ? banner.displayLocation : [],
                startDate: banner.startDate || new Date().toISOString(),
                endDate: banner.endDate || new Date().toISOString(),
                link: banner.link || '',
                createdAt: banner.createdAt || new Date().toISOString(),
                updatedAt: banner.updatedAt || new Date().toISOString()
            };
            setSelectedBanner(typedBanner);
            setUpdateOpen(true);
            setTestimonialId(id);
        } else {
            toast.error("Banner not found");
        }
    }

    const handleViewBanner = (id: string) => {
        const banner = bannerData?.data?.find((b: any) => b._id === id);
        if (banner) {
            // Ensure all required fields are present and properly typed
            const typedBanner: Banner = {
                _id: banner._id,
                title: banner.title || '',
                description: banner.description || '',
                image: banner.image || '',
                isActive: banner.isActive || false,
                order: banner.order || 0,
                type: banner.type || '',
                targetAudience: banner.targetAudience || '',
                displayLocation: Array.isArray(banner.displayLocation) ? banner.displayLocation : [],
                startDate: banner.startDate || new Date().toISOString(),
                endDate: banner.endDate || new Date().toISOString(),
                link: banner.link || '',
                createdAt: banner.createdAt || new Date().toISOString(),
                updatedAt: banner.updatedAt || new Date().toISOString()
            };
            setSelectedBanner(typedBanner);
            setDetailModalOpen(true);
        } else {
            toast.error("Banner not found");
        }
    }

    const handleDeleteModalOpen = (id: string) => {
        setDeleteModal(true);
        setTestimonialId(id);
    }


    const handleUpdate = async (data: any) => {
        try {
            if (!testimonialId) {
                toast.error("Banner ID is missing");
                return;
            }

            const formData = new FormData();
            // Add all fields to formData
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('link', data.link);
            formData.append('isActive', String(data.isActive));
            formData.append('order', String(data.order));
            formData.append('type', data.type);
            formData.append('targetAudience', data.targetAudience);

            // Handle array fields
            if (Array.isArray(data.displayLocation)) {
                data.displayLocation.forEach((location: string) => {
                    formData.append('displayLocation', location);
                });
            }

            // Handle dates
            if (data.startDate) {
                formData.append('startDate', new Date(data.startDate).toISOString());
            }
            if (data.endDate) {
                formData.append('endDate', new Date(data.endDate).toISOString());
            }

            // Handle image if a new one is selected
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            await updateBannerById(testimonialId, formData);

            toast.success("Banner updated successfully.");
            setUpdateOpen(false);
            setSelectedBanner(null);
            setSelectedFile(null);
            refetch();
        } catch (error: any) {
            console.error("Error updating banner:", error);
            toast.error(error?.response?.data?.message);
        }
    };



    // Removed duplicate handleDetailModal function


    const handleDelete = async () => {
        try {
            if (!testimonialId) {
                toast.error("Banner ID is missing");
                return;
            }

            await deleteBanner(testimonialId);

            toast.success("Banner deleted successfully");
            setDeleteModal(false);
            setTestimonialId(null);
            refetch(); // Refresh the banner list
        } catch (error: any) {
            console.error("Error deleting banner:", error);
            toast.error(error?.response?.data?.message);
        }
    };



    return (
        <>
            <TabsContent value="allbanners" className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Banner Management</CardTitle>
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Banner
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <BannerList
                            bannerData={bannerData}
                            isLoading={isLoading}
                            onEdit={handleUpdateModalOpen}
                            onView={handleViewBanner}
                            onDelete={handleDeleteModalOpen}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <AddCityModal
                open={open}
                setOpen={setOpen}
                onSubmit={handleAdd}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
            />

            {updateopen && selectedBanner && (
                <UpdateModal
                    open={updateopen}
                    setOpen={setUpdateOpen}
                    testimonialId={selectedBanner._id}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    refetch={refetch}
                />
            )}

            {detailModalopen && selectedBanner && (
                <DetailModal
                    open={detailModalopen}
                    setOpen={setDetailModalOpen}
                    banner={selectedBanner}
                />
            )}

            <DeleteModal
                open={deleteModal}
                setOpen={setDeleteModal}
                onDelete={handleDelete}
            />
        </>
    )
}


export default BannerMain
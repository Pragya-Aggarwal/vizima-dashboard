"use client"

import { useState } from "react"
import { toast } from "sonner"
import { TestimonialFormData } from "./Schema/testimonial-schema"
import { addTestimonial } from "@/src/services/testmonialServices"
import { Plus, Edit, Trash2, Eye, Upload, ImageIcon, Globe, Star, MapPin, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// here
import { getTestimonial } from "@/src/services/testmonialServices"
import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import TestimonialList from "./TestimonialList/testimonialList"
import AddTestimonialModal from "./AddNewTestimonial/AddNewTestimonial"
import UpdateTestimonialModal from "./UpdateTestimonial/updateTestimonial"
import { updateTestimonialById } from "@/src/services/testmonialServices"
import TestimonialDetailModal from "./DetailModal/detailModal"
import { DeleteModal } from "@/src/common/DeleteModal/deleteModal"
import { deleteTestimonialbyId } from "@/src/services/testmonialServices"


const TestimonialMain = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [open, setOpen] = useState(false)
    const [updateopen, setUpdateOpen] = useState(false)
    const [detailModalopen, setDetailModalOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)


    const [testimonialId, setTestimonialId] = useState<string | null | undefined>();



    const ITEMS_PER_PAGE = 10

    const fetchTestimonial = useCallback(() => {
        const payload: any = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,

        };
        return getTestimonial(payload);
    }, [
        currentPage,
    ]);


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['properties', currentPage],
        queryFn: fetchTestimonial,
    });

    const testimonial = data?.data || [];
    const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE) || 1;
    const totalRecord = data?.total;

    const handleAddTestimonial = async (
        data: TestimonialFormData,
        onSuccess: () => void
    ) => {
        try {
            const res = await addTestimonial(data);
            toast.success("Testimonial added successfully!");
            onSuccess();
            setOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add Testimonial");
        }
    };


    const handleUpdateModalOpen = (id: string) => {
        setUpdateOpen(true)
        setTestimonialId(id)
    }

    const handleDeleteModalOpen = (id: string) => {
        setDeleteModal(true)
        setTestimonialId(id)
    }


    const handleUpdateTestimonial = async (
        data: TestimonialFormData,
        onSuccess: () => void
    ) => {
        try {
            if (!testimonialId) {
                toast.error("Toastimonial ID is missing");
                return;
            }
            const res = await updateTestimonialById(testimonialId, data);
            toast.success("Testimonial updated successfully.");
            onSuccess();
            setUpdateOpen(false);
            refetch();
        } catch (error: any) {
            console.error("Error adding property:", error);
            toast.error(error?.response?.data?.message || "Failed to update testimonial");
        }
    };



    const handleDetailModal = async (id: string) => {

        setDetailModalOpen(true)
        setTestimonialId(id)
    }


    const handleDelete = async () => {
        if (!testimonialId) return;
        try {
            const res = await deleteTestimonialbyId(testimonialId);

            toast.success("Testimonial deleted successfully");
            refetch(); // Refresh the data
            setDeleteModal(false); // Close the modal
        } catch (error) {
            toast.error("Something went wrong while deleting testimonial");
            console.error("Delete error:", error);
        }
    };


    return (
        <>

            <TabsContent value="testimonials" className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Customer Testimonials</CardTitle>
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Testimonial
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <TestimonialList testimonial={testimonial} isLoading={isLoading} handleUpdateModalOpen={handleUpdateModalOpen} handleDetailModal={handleDetailModal} handleDeleteModalOpen={handleDeleteModalOpen} />

                        {!isLoading && totalRecord !== 0 && totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between px-2">
                                <div className="text-sm text-muted-foreground">
                                    Showing page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        First
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Last
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <AddTestimonialModal open={open} setOpen={setOpen} onSubmit={handleAddTestimonial} />

            <UpdateTestimonialModal open={updateopen} setOpen={setUpdateOpen} onSubmit={handleUpdateTestimonial} testimonialId={testimonialId ?? null} />


            <TestimonialDetailModal open={detailModalopen} setOpen={setDetailModalOpen} testimonialId={testimonialId ?? null} />

            <DeleteModal open={deleteModal} setOpen={setDeleteModal} onDelete={handleDelete} />

        </>


    )


}


export default TestimonialMain
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
import Pagination from "@/src/common/pagination/pagination"
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


    console.log("testimonail data", data)

    const testimonial = data?.data || [];
    const totalPages = data?.page;
    const totalRecord = data?.total

    console.log("testimonial", testimonial)

    console.log("total record", totalRecord, totalPages)



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


    const handleUpdateModalOpen = (id) => {
        setUpdateOpen(true)
        setTestimonialId(id)
        console.log("testimonial id in function", id)
    }

    const handleDeleteModalOpen = (id) => {
        setDeleteModal(true)
        setTestimonialId(id)
        console.log("testimonial id in function", id)
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
            const res = await updateTestimonialById(testimonialId, data)
            toast.success("Toastimonial updated successfully.");
            onSuccess();
            setUpdateOpen(false);
            refetch();
            // console.log("Server response =>", res);
        } catch (error: any) {
            console.error("Error adding property:", error);
            toast.error(error?.response?.data?.message || "Failed to update testimonial");
        }
    };



    const handleDetailModal = async (id) => {

        setDetailModalOpen(true)
        setTestimonialId(id)
    }


    const handleDelete = async () => {
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

                        {isLoading == false && totalRecord != 0 &&
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        }
                    </CardContent>
                </Card>
            </TabsContent>

            <AddTestimonialModal open={open} setOpen={setOpen} onSubmit={handleAddTestimonial} />

            <UpdateTestimonialModal open={updateopen} setOpen={setUpdateOpen} onSubmit={handleUpdateTestimonial} testimonialId={testimonialId} />


            <TestimonialDetailModal open={detailModalopen} setOpen={setDetailModalOpen} testimonialId={testimonialId} />

            <DeleteModal open={deleteModal} setOpen={setDeleteModal} testimonialId={testimonialId} handleDelete={handleDelete} />

        </>


    )


}


export default TestimonialMain
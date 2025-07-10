"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import DetailModal from "./DetailModal/detailModal"
import { DeleteModal } from "@/src/common/DeleteModal/deleteModal"
import { SchemaFormData } from "./Schema/schema"

// city data
import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"


// faq data
import { addFaq, deleteFaqbyId, getFaqs, updateFaqById } from "@/src/services/FaqServices"
import FaqList from "./FaqList/list"
import AddFaqModal from "./AddNewFaq/AddNewFaq"
import UpdateModal from "./Update/update"








const FaqMain = () => {

    const [pageState, setPageState] = useState(1);
    const [open, setOpen] = useState(false)
    const [updateopen, setUpdateOpen] = useState(false)
    const [detailModalopen, setDetailModalOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)


    const [testimonialId, setTestimonialId] = useState<string | null | undefined>();
    const ITEMS_PER_PAGE = 10


    const fetchFaq = () => {
        return getFaqs({ page: pageState, limit: ITEMS_PER_PAGE });
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['faqs', pageState],
        queryFn: fetchFaq,
    });

    const faqList = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;
    const totalRecord = data?.pagination?.totalItems || 0;
    const currentPage = data?.pagination?.currentPage || 1;


    const handleAdd = async (
        data: SchemaFormData,
        onSuccess: () => void
    ) => {
        try {
            const res = await addFaq(data);
            toast.success("Faq added successfully!");
            onSuccess();
            setOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add Faq");
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


    const handleUpdate = async (
        data: SchemaFormData,
        onSuccess: () => void
    ) => {
        try {
            if (!testimonialId) {
                toast.error("Faq ID is missing");
                return;
            }
            const res = await updateFaqById(testimonialId, data)
            toast.success("Faq updated successfully.");
            onSuccess();
            setUpdateOpen(false);
            refetch();
        } catch (error: any) {
            console.error("Error adding property:", error);
            toast.error(error?.response?.data?.message || "Failed to update Faq");
        }
    };



    const handleDetailModal = async (id: string) => {
        setDetailModalOpen(true)
        setTestimonialId(id)
    }


    const handleDelete = async () => {
        if (!testimonialId) return;
        try {
            const res = await deleteFaqbyId(testimonialId);
            toast.success("Faq deleted successfully");
            refetch();
            setDeleteModal(false);
        } catch (error) {
            toast.error("Something went wrong while deleting Faq");
            console.error("Delete error:", error);
        }
    };



    return (
        <>

            <TabsContent value="faqs" className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Faq Management</CardTitle>
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Faq
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <FaqList faqList={faqList} isLoading={isLoading} handleUpdateModalOpen={handleUpdateModalOpen} handleDetailModal={handleDetailModal} handleDeleteModalOpen={handleDeleteModalOpen} />




                        {!isLoading && totalRecord !== 0 && totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between px-2">
                                <div className="text-sm text-muted-foreground">
                                    Showing page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPageState(1)}
                                        disabled={currentPage === 1}
                                    >
                                        First
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPageState(prev => Math.max(1, prev - 1))}
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
                                        onClick={() => setPageState(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPageState(totalPages)}
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


            <AddFaqModal open={open} setOpen={setOpen} onSubmit={handleAdd} />

            <UpdateModal open={updateopen} setOpen={setUpdateOpen} onSubmit={handleUpdate} testimonialId={testimonialId ?? null} />


            <DetailModal open={detailModalopen} setOpen={setDetailModalOpen} testimonialId={testimonialId ?? null} />

            <DeleteModal open={deleteModal} setOpen={setDeleteModal} onDelete={handleDelete} />

        </>


    )


}


export default FaqMain
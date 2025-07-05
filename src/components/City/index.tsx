"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import DetailModal from "./DetailModal/detailModal"
import { DeleteModal } from "@/src/common/DeleteModal/deleteModal"
import { SchemaFormData } from "./Schema/schema"
import { addcity } from "@/src/services/cityServices"

// city data
import { getCities } from "@/src/services/cityServices"
import Pagination from "@/src/common/pagination/pagination"
import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import CityList from "./CitiesList/list"
import AddCityModal from "./AddNewCity/AddNewCity"
import UpdateModal from "./UpdateCity/updateCity"
import { updateCityById } from "@/src/services/cityServices"
import { deleteCitybyId } from "@/src/services/cityServices"







const CityMain = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [open, setOpen] = useState(false)
    const [updateopen, setUpdateOpen] = useState(false)
    const [detailModalopen, setDetailModalOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)


    const [testimonialId, setTestimonialId] = useState<string | null | undefined>();
    const ITEMS_PER_PAGE = 10

    const fetchCities = useCallback(() => {
        const payload: any = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,

        };
        return getCities(payload);
    }, [
        currentPage,
    ]);


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [currentPage],
        queryFn: fetchCities,
    });const citiesData = data?.data || [];
    const totalPages = data?.totalPages;
    const totalRecord = data?.total


    const handleAdd = async (
        data: SchemaFormData,
        onSuccess: () => void
    ) => {
        try {
            const res = await addcity(data);
            toast.success("City added successfully!");
            onSuccess();
            setOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add City");
        }
    };


    const handleUpdateModalOpen = (id) => {
        setUpdateOpen(true)
        setTestimonialId(id)}

    const handleDeleteModalOpen = (id) => {
        setDeleteModal(true)
        setTestimonialId(id)}


    const handleUpdate = async (
        data: SchemaFormData,
        onSuccess: () => void
    ) => {
        try {
            if (!testimonialId) {
                toast.error("City ID is missing");
                return;
            }
            const res = await updateCityById(testimonialId, data)
            toast.success("City updated successfully.");
            onSuccess();
            setUpdateOpen(false);
            refetch();
            //} catch (error: any) {
            console.error("Error adding property:", error);
            toast.error(error?.response?.data?.message || "Failed to update city");
        }
    };



    const handleDetailModal = async (id) => {

        setDetailModalOpen(true)
        setTestimonialId(id)
    }


    const handleDelete = async () => {
        try {
            const res = await deleteCitybyId(testimonialId);
            toast.success("City deleted successfully");
            refetch();
            setDeleteModal(false);
        } catch (error) {
            toast.error("Something went wrong while deleting city");
            console.error("Delete error:", error);
        }
    };



    return (
        <>

            <TabsContent value="cities" className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>City Management</CardTitle>
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add City
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <CityList citiesData={citiesData} isLoading={isLoading} handleUpdateModalOpen={handleUpdateModalOpen} handleDetailModal={handleDetailModal} handleDeleteModalOpen={handleDeleteModalOpen} />

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

            <AddCityModal open={open} setOpen={setOpen} onSubmit={handleAdd} />

            <UpdateModal open={updateopen} setOpen={setUpdateOpen} onSubmit={handleUpdate} testimonialId={testimonialId} />


            <DetailModal open={detailModalopen} setOpen={setDetailModalOpen} testimonialId={testimonialId} />

            <DeleteModal open={deleteModal} setOpen={setDeleteModal} testimonialId={testimonialId} handleDelete={handleDelete} />

        </>


    )


}


export default CityMain
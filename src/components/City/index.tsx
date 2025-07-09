"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { getCities, deleteCitybyId, updateCityById, addcity } from "@/src/services/cityServices"
import { CityFormData } from "@/types/city"
import Pagination from "@/src/common/pagination/pagination"
import CityList from "./CitiesList/list"
import AddCityModal from "./AddNewCity/AddNewCity"
import UpdateModal from "./UpdateCity/updateCity"
import DetailModal from "./DetailModal/detailModal"
import { DeleteModal } from "@/src/common/DeleteModal/deleteModal"

const CityMain = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [cityId, setCityId] = useState<string>("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const ITEMS_PER_PAGE = 10

    const fetchCities = useCallback(async (page: number) => {
        const payload = {
            page,
            limit: ITEMS_PER_PAGE,
        };
        return getCities(payload);
    }, [ITEMS_PER_PAGE]);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['cities', currentPage],
        queryFn: () => fetchCities(currentPage),
    });

    const citiesData = data?.data || [];
    const totalPages = data?.totalPages;
    const totalRecord = data?.total

    const handleAdd = useCallback(async (
        data: CityFormData,
        onSuccess: () => void
    ) => {
        try {
            await addcity(data); // Empty string for new city
            toast.success("City added successfully!");
            onSuccess();
            setAddOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add City");
        }
    }, [refetch]);

    const handleUpdateModalOpen = (id: string) => {
        setUpdateOpen(true);
        console.log(id,"id")
        setCityId(id);
    };

    const handleDeleteModalOpen = (id: string) => {
        setDeleteModal(true);
        setCityId(id);
    };

    const handleUpdate = useCallback(async (
        id: string,
        data: CityFormData,
        onSuccess: () => void
    ) => {
        console.log(id,"id")
        try {
            if (!id) {
                toast.error("City ID is missing");
                return;
            }
            const res = await updateCityById(id, data);
            toast.success("City updated successfully.");
            onSuccess();
            setUpdateOpen(false);
            refetch();
        } catch (error: any) {
            console.error("Error updating city:", error);
            toast.error(error?.response?.data?.message || "Failed to update city");
        }
    }, [refetch]);

    const handleDetailModal = (id: string) => {
        setDetailModalOpen(true);
        setCityId(id);
    };

    const handleDelete = useCallback(async () => {
        if (!cityId) {
            toast.error("City ID is missing");
            return;
        }
        try {
            const res = await deleteCitybyId(cityId);
            toast.success("City deleted successfully");
            refetch();
            setDeleteModal(false);
        } catch (error) {
            toast.error("Something went wrong while deleting city");
            console.error("Delete error:", error);
        }
    }, [cityId, refetch]);

    return (
        <>

            <TabsContent value="cities" className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>City Management</CardTitle>
                            <Button onClick={() => setAddOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add City
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <CityList 
                            data={citiesData} 
                            onEdit={handleUpdateModalOpen}
                            onDelete={handleDeleteModalOpen}
                            onView={handleDetailModal}
                            isLoading={isLoading}
                        />

                        {isLoading == false && totalRecord != 0 &&
                            totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page: number) => setCurrentPage(page)}
                                />
                            )
                        }
                    </CardContent>
                </Card>
            </TabsContent>

            <AddCityModal open={addOpen} setOpen={setAddOpen} onSubmit={handleAdd} />

            <UpdateModal
                open={updateOpen}
                setOpen={setUpdateOpen}
                onSubmit={(data, onSuccess) => handleUpdate(cityId, data, onSuccess)}
                cityId={cityId}
            />

            <DetailModal 
                open={detailModalOpen} 
                setOpen={setDetailModalOpen} 
                cityId={cityId} 
            />

            <DeleteModal
                open={deleteModal}
                setOpen={setDeleteModal}
                onDelete={handleDelete}
                title="Delete City"
                description="Are you sure you want to delete this city? This action cannot be undone."
            />

        </>

    )


}


export default CityMain
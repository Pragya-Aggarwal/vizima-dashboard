import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, Upload, ImageIcon, Globe, Star, MapPin, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FC } from "react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import { formatReadableDate } from "@/src/common/common"
import UpdateTestimonialModal from "../UpdateTestimonial/updateTestimonial"




type City = {
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




type CityListProps = {
    citiesData: City[];
    handleUpdateModalOpen: (id: string) => void; // ✅ Add this line
    isLoading: boolean;
    handleDetailModal: (id: string) => void;
    handleDeleteModalOpen: (id: string) => void;
};





const CityList: FC<CityListProps> = ({ citiesData, isLoading, handleUpdateModalOpen, handleDetailModal, handleDeleteModalOpen }) => {return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>City Name</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                                <LoadingIndicator />
                            </TableCell>
                        </TableRow>
                    ) : citiesData?.length > 0 ? (
                        citiesData?.map((elem, index) => (
                            <TableRow key={elem._id || index}>

                                <TableCell>
                                    <div>
                                        <p className="font-medium">{elem?.name}</p>
                                        <p className="text-sm text-muted-foreground">{formatReadableDate(elem?.createdAt)}</p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant={elem?.isVisible == true ? "default" : "secondary"}>
                                        {elem?.isVisible == true ? "Visible" : "Not Visible"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm truncate max-w-48">{elem?.order}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="sm" onClick={(() => handleDetailModal(elem?._id))}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={(() => handleUpdateModalOpen(elem?._id))}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={(() => handleDeleteModalOpen(elem?._id))}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>


                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No City found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </>

    )



}


export default CityList
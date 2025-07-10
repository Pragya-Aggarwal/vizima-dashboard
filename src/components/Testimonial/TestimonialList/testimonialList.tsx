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




type Testimonial = {
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




type TestimonialListProps = {
    testimonial: Testimonial[];
    handleUpdateModalOpen: (id: string) => void; // ✅ Add this line
    isLoading: boolean;
    handleDetailModal: (id: string) => void;
    handleDeleteModalOpen: (id: string) => void;
};





const TestimonialList: FC<TestimonialListProps> = ({ testimonial, isLoading, handleUpdateModalOpen, handleDetailModal,handleDeleteModalOpen }) => {const testimonials = [
        {
            id: "TST001",
            name: "John Doe",
            rating: 5,
            comment: "Great service and amazing properties!",
            property: "Sunrise PG",
            status: "approved",
            date: "2024-01-15",
        },
        {
            id: "TST002",
            name: "Sarah Wilson",
            rating: 4,
            comment: "Very helpful staff and clean accommodations.",
            property: "Green Valley Hostel",
            status: "pending",
            date: "2024-01-16",
        },
    ]




    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Order</TableHead>
                        {/* <TableHead>Status</TableHead> */}
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
                    ) : testimonial?.length > 0 ? (
                        testimonial.map((testimonial, index) => (
                            <TableRow key={testimonial._id || index}>



                                <TableCell>
                                    <div>
                                        <p className="font-medium">{testimonial?.name}</p>
                                        <p className="text-sm text-muted-foreground">{formatReadableDate(testimonial?.createdAt)}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{testimonial?.city}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="ml-1 text-sm">{testimonial?.rating}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm truncate max-w-48">{testimonial?.order}</p>
                                </TableCell>
                                {/* <TableCell>
                                    <Badge variant={testimonial.status === "approved" ? "default" : "secondary"}>
                                        {testimonial.status}
                                    </Badge>
                                </TableCell> */}
                                <TableCell>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="sm" onClick={(() => handleDetailModal(testimonial?._id))}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={(() => handleUpdateModalOpen(testimonial?._id))}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={(() => handleDeleteModalOpen(testimonial?._id))}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>


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

        </>

    )



}


export default TestimonialList
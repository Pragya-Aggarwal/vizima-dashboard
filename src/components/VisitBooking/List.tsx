"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2 } from "lucide-react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading";
import BookingDetailsDialog from "./DetailModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Booking = {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    guests: number;
    checkIn: string;
    checkOut: string;
    sharing: string;
    totalAmount: number;
    paymentStatus: string;
    status: string;
    createdAt: string;
};

type Props = {
    data: Booking[];
    loading: boolean;
    totalBookings: number;
    totalRecord: number;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
};

const VisitBookingTable = ({
    data,
    loading,
    totalBookings,
    totalRecord,
    currentPage,
    totalPages,
    setCurrentPage,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null); const handleOpenModal = (id: string) => {
        setSelectedId(id);
        setOpen(true);
    };

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Visit Date</TableHead>
                        <TableHead>Time Slot</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                                <LoadingIndicator />
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground text-sm">
                                No visit bookings found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell>{booking?.name}</TableCell>
                                <TableCell>{booking?.phone}</TableCell>
                                <TableCell>{new Date(booking?.date).toLocaleDateString()}</TableCell>
                                <TableCell>{booking?.timeSlot}</TableCell>
                                <TableCell className="capitalize">{booking?.mode}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            booking.status === "confirmed"
                                                ? "default"
                                                : booking?.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {booking?.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">{booking?.description}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenModal(booking?._id)}
                                        title="View booking details"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {selectedId && (
                <BookingDetailsDialog open={open} setOpen={setOpen} id={selectedId} />
            )}
        </div>
    );
};

export default VisitBookingTable;

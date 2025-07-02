import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading";
import Pagination from "@/src/common/pagination/pagination";
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

const BookingTable = ({ data, loading, totalBookings, totalRecord, currentPage, totalPages, setCurrentPage }: Props) => {

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleOpenModal = (id: string) => {
        setSelectedId(id);
        setOpen(true);
    };

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Sharing</TableHead>
                        <TableHead>Check-In</TableHead>
                        <TableHead>Check-Out</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Action</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-6">
                                <div className="flex justify-center items-center gap-2">
                                    <LoadingIndicator />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-6 text-muted-foreground text-sm">
                                No bookings found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell>{booking.fullName}</TableCell>
                                <TableCell>{booking.email}</TableCell>
                                <TableCell>{booking.phoneNumber}</TableCell>
                                <TableCell>{booking.guests}</TableCell>
                                <TableCell className="capitalize">{booking.sharing}</TableCell>
                                <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                                <TableCell>₹ {booking.totalAmount ? booking.totalAmount.toLocaleString() : '0'}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            booking.status === "approved"
                                                ? "default"
                                                : booking.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            booking.paymentStatus === "paid" ? "default" : "secondary"
                                        }
                                    >
                                        {booking.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenModal(booking?._id)}>View</Button>
                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {loading == false && totalRecord != 0 &&
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            }


            {selectedId && (
                <BookingDetailsDialog open={open} setOpen={setOpen} id={selectedId} />
            )}
        </div>
    );
};

export default BookingTable;

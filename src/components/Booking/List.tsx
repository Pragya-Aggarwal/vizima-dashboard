import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Trash2, Edit } from "lucide-react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading";
import Pagination from "@/src/common/pagination/pagination";
import BookingDetailsDialog from "./DetailModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteVisitBooking } from "@/src/services/BookingServices";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    onDelete: () => void;
};

const BookingTable = ({
    data,
    loading,
    totalBookings,
    totalRecord,
    currentPage,
    totalPages,
    setCurrentPage,
    onDelete,
}: Props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleViewDetails = (id: string) => {router.push(`/dashboard/bookings/${id}`);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (id: string) => {
        setEditingId(id);
        setEditModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        setIsDeleting(true);
        try {
            await deleteVisitBooking(deletingId);
            toast.success("Booking deleted successfully");
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Failed to delete booking:", error);
            toast.error("Failed to delete booking. Please try again.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
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
                                <TableCell className="capitalize">
                                    {booking.sharing}
                                </TableCell>
                                <TableCell>
                                    {new Date(booking.checkIn).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(booking.checkOut).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    ₹{" "}
                                    {booking.totalAmount
                                        ? booking.totalAmount.toLocaleString()
                                        : "0"}
                                </TableCell>
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
                                            booking.paymentStatus === "paid"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {booking.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleEditClick(booking?._id)
                                            }
                                            title="View booking details"
                                            className="h-8 w-8 p-0"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {/* <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleEditClick(booking?._id)
                                            }
                                            title="Edit booking"
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button> */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteClick(booking?._id)
                                            }
                                            title="Delete booking"
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting &&
                                                deletingId === booking?._id ? (
                                                <Loader2
                                                    className="h-4 w-4 animate-spin"
                                                />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {loading == false && totalRecord != 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}

            {selectedId && (
                <BookingDetailsDialog
                    open={open}
                    setOpen={setOpen}
                    id={selectedId}
                />
            )}

            {editingId && (
                <BookingDetailsDialog
                    open={editModalOpen}
                    setOpen={setEditModalOpen}
                    id={editingId}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the booking record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2
                                        className="mr-2 h-4 w-4 animate-spin"
                                    />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default BookingTable;

"use client"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    CreditCard,
    Edit,
    Loader2,
    Mail,
    Phone,
    User,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingById } from "@/src/services/BookingServices";
import { useEffect } from "react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading";

type Props = {
    open: boolean;
    setOpen: (val: boolean) => void;
    id: string;
};


const BookingDetailsDialog = ({ open, setOpen, id }: Props) => {

    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (open && id) {
                setLoading(true);
                try {
                    const res = await getBookingById(id);
                    setBooking(res?.data);
                } catch (error) {
                    console.error("Failed to fetch booking detail", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBooking();
    }, [id, open]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN");

    const getDuration = (checkIn: string, checkOut: string) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diff = Math.abs(outDate.getTime() - inDate.getTime());
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + " Nights";
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>Booking ID: {id}</DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <LoadingIndicator />
                    </div>
                ) : booking ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">User Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {booking.user?.name || booking.fullName}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{booking.user?.email || booking.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {booking.user?.phone || booking.phoneNumber}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Booking Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Guests:</span>
                                        <span className="font-medium">{booking.guests}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Sharing:</span>
                                        <span className="capitalize">{booking.sharing}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Gender:</span>
                                        <span className="capitalize">{booking.gender}</span>
                                    </div>
                                    {booking.specialRequests && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Special Request:</span>
                                            <span className="text-sm">{booking.specialRequests}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* 2. Stay Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Stay Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Check-in</Label>
                                        <p className="font-medium">{formatDate(booking.checkIn)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Check-out</Label>
                                        <p className="font-medium">{formatDate(booking.checkOut)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Duration</Label>
                                        <p className="font-medium">
                                            {getDuration(booking.checkIn, booking.checkOut)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Payment Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Payment Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Amount:</span>
                                    <span className="font-bold text-lg">
                                        {booking.totalAmount > 0
                                            ? `₹${booking.totalAmount.toLocaleString()}`
                                            : "Free Visit"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                                    <Badge
                                        variant={
                                            booking.paymentStatus === "paid"
                                                ? "default"
                                                : booking.paymentStatus === "refunded"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {booking.paymentStatus}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Booking Status:</span>
                                    <Badge
                                        variant={
                                            booking.status === "confirmed"
                                                ? "default"
                                                : booking.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Actions */}
                        <div className="flex justify-between">
                            <div className="space-x-2">
                                <Button variant="outline">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Reschedule
                                </Button>
                                <Button variant="outline">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Refund
                                </Button>
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Close
                                </Button>
                                {/* <Button>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Booking
                                </Button> */}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No booking detail found.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}


export default BookingDetailsDialog

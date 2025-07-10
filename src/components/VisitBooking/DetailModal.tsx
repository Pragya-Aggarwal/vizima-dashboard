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
import { getVisitBookingById } from "@/src/services/BookingServices";
import { formatReadableDate } from "@/src/common/common";

type Props = {
    open: boolean;
    setOpen: (val: boolean) => void;
    id: string;
};


const BookingDetailsDialog = ({ open, setOpen, id }: Props) => {

    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<any>(null); useEffect(() => {
        const fetchBooking = async () => {
            if (open && id) {
                setLoading(true);
                try {
                    const res = await getVisitBookingById(id);
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
                    <DialogTitle>Visit Booking Details</DialogTitle>
                    <DialogDescription>Booking ID: {id}</DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <LoadingIndicator />
                    </div>
                ) : booking ? (
                    <div className="space-y-6">
                        {/* User Information */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Visitor Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Name:</span>
                                    <span className="font-medium">{booking.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{booking.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Mode:</span>
                                    <span className="capitalize">{booking.mode}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visit Information */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Visit Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Date:</span>
                                    <span className="font-medium">
                                        {/* {format(new Date(booking.date), "dd MMM yyyy")} */}
                                        {formatReadableDate(booking?.date)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Time Slot:</span>
                                    <span className="font-medium">{booking?.timeSlot}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    <Badge
                                        variant={
                                            booking?.status === "confirmed"
                                                ? "default"
                                                : booking?.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {booking?.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{booking.description}</p>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-between">
                            <div className="space-x-2">
                                {/* <Button variant="outline">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Reschedule
                                </Button> */}
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
                        No visit booking details found.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}


export default BookingDetailsDialog

"use client"

import { useState } from "react"
import {
    Filter,
    Download,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    User,
    Phone,
    Mail,
    CreditCard,
    CalendarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const BookingMain = () => {


    const bookings = [
        {
            id: "BK001",
            user: {
                name: "John Doe",
                email: "john@example.com",
                phone: "+91 9876543210",
            },
            property: "Sunrise PG",
            room: "A-101",
            type: "Room",
            status: "confirmed",
            amount: 8500,
            date: "2024-01-15",
            checkIn: "2024-02-01",
            checkOut: "2024-02-28",
            source: "Vizima",
            paymentStatus: "paid",
            duration: "1 month",
        },
        {
            id: "BK002",
            user: {
                name: "Sarah Wilson",
                email: "sarah@example.com",
                phone: "+91 9876543211",
            },
            property: "Green Valley Hostel",
            room: "Visit Slot",
            type: "Visit",
            status: "pending",
            amount: 0,
            date: "2024-01-16",
            checkIn: "2024-01-18",
            checkOut: "2024-01-18",
            source: "RentOk",
            paymentStatus: "na",
            duration: "1 day",
        },
        {
            id: "BK003",
            user: {
                name: "Mike Johnson",
                email: "mike@example.com",
                phone: "+91 9876543212",
            },
            property: "City Center PG",
            room: "C-301",
            type: "Room",
            status: "confirmed",
            amount: 9800,
            date: "2024-01-14",
            checkIn: "2024-01-20",
            checkOut: "2024-04-20",
            source: "Vizima",
            paymentStatus: "paid",
            duration: "3 months",
        },
        {
            id: "BK004",
            user: {
                name: "Emma Davis",
                email: "emma@example.com",
                phone: "+91 9876543213",
            },
            property: "Sunrise PG",
            room: "A-102",
            type: "Room",
            status: "cancelled",
            amount: 8500,
            date: "2024-01-13",
            checkIn: "2024-01-25",
            checkOut: "2024-02-25",
            source: "Vizima",
            paymentStatus: "refunded",
            duration: "1 month",
        },
    ]

    return (

        <>
            <TabsContent value={selectedTab} className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Booking List</CardTitle>
                            <div className="flex space-x-2">
                                <div className="relative">
                                    <Input placeholder="Search bookings..." className="w-64" />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    More Filters
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>
                                            <div className="font-medium">{booking.id}</div>
                                            <div className="text-xs text-muted-foreground">{booking.date}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {booking.user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{booking.user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{booking.property}</p>
                                                <p className="text-xs text-muted-foreground">{booking.room}</p>
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    {booking.source}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{booking.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="flex items-center">
                                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                                    {booking.checkIn}
                                                </div>
                                                <div className="text-xs text-muted-foreground">to {booking.checkOut}</div>
                                                <div className="text-xs text-muted-foreground">({booking.duration})</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {booking.amount > 0 ? `₹${booking?.amount}` : "Free"}
                                            </div>
                                            <Badge
                                                variant={
                                                    booking.paymentStatus === "paid"
                                                        ? "default"
                                                        : booking.paymentStatus === "refunded"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                                className="text-xs"
                                            >
                                                {booking.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    booking.status === "confirmed"
                                                        ? "default"
                                                        : booking.status === "pending"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {booking.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {booking.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                                {booking.status === "cancelled" && <XCircle className="h-3 w-3 mr-1" />}
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-1">
                                                {/* <BookingDetailsDialog booking={booking} /> */}
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {booking.status === "pending" && (
                                                    <>
                                                        <Button variant="ghost" size="sm" className="text-green-600">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-600">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )


}


export default BookingMain
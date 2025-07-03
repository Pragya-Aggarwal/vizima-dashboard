"use client"

import { useState } from "react"
import { getBookings } from "@/src/services/BookingServices"
import { getVisitBookings } from "@/src/services/BookingServices"
import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"


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
import BookingTable from "@/src/components/Booking/List"
import VisitBookingTable from "@/src/components/VisitBooking/List"
import { useAuthRedirect } from "@/hooks/use-Redirect"

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

function BookingDetailsDialog({ booking }: { booking: (typeof bookings)[0] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details - {booking.id}</DialogTitle>
          <DialogDescription>Complete booking information and management options</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{booking.user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.user.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Property:</span>
                  <span className="font-medium">{booking.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Room:</span>
                  <span className="font-medium">{booking.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline">{booking.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Source:</span>
                  <Badge variant="secondary">{booking.source}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Stay Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Check-in</Label>
                  <p className="font-medium">{booking.checkIn}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Check-out</Label>
                  <p className="font-medium">{booking.checkOut}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Duration</Label>
                  <p className="font-medium">{booking.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">
                  {booking.amount > 0 ? `₹${booking.amount.toLocaleString()}` : "Free Visit"}
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
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Booking
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BookingsPage() {

  const [selectedTab, setSelectedTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState('')
  useAuthRedirect();

  const filteredBookings = bookings.filter((booking) => {
    if (selectedTab === "room" && booking.type !== "Room") return false
    if (selectedTab === "visit" && booking.type !== "Visit") return false
    if (statusFilter !== "all" && booking.status !== statusFilter) return false
    return true
  })

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.amount, 0),
  }


  // dynamic

  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 10;

  const fetchBooking = useCallback(() => {
    const payload: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(search && { search }),
    };
    return getBookings(payload);
  }, [currentPage, search]);


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [currentPage, search],
    queryFn: fetchBooking,
  });


  console.log("Booking data by akib", data)

  const bookingData = data?.data || [];
  const totalPages = data?.pagination?.totalPages;
  const totalRecord = data?.pagination?.totalBookings;


  console.log("booking data", bookingData, totalPages, totalRecord)

  // visitbookin

  // ----------- Visit Booking API -----------
  const fetchVisitBooking = useCallback(() => {
    const payload: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(search && { search }),
    };
    return getVisitBookings(payload);
  }, [currentPage, search]);

  const {
    data: dataVisitBooking,
    isLoading: isLoadingVisit,
    isError: isErrorVisit,
    refetch: refetchVisit,
  } = useQuery({
    queryKey: ["visitBookings", currentPage, search],
    queryFn: fetchVisitBooking,
  });

  const visitBookingData = dataVisitBooking?.data || [];
  const totalPagesVisit = dataVisitBooking?.page || 1;
  const totalVisitRecord = dataVisitBooking?.total || 0;

  console.log("visit booking", visitBookingData)
  console.log("total page", totalPagesVisit, totalVisitRecord)

  const handleExport = () => {
    try {
      console.log('Export button clicked');
      console.log('Bookings data:', bookings); // Debug: check bookings data

      if (!bookings || bookings.length === 0) {
        console.error('No bookings data available');
        return;
      }

      // Format bookings data for export
      const dataToExport = bookings.map(booking => ({
        'Booking ID': booking.id || 'N/A',
        'User': booking.user?.name || booking.user?.email || 'N/A',
        'Property': booking.property || 'N/A',
        'Check-In': booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A',
        'Check-Out': booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A',
        'Status': booking.status || 'N/A',
        'Total Amount': booking.amount || 0,
        'Payment Status': booking.paymentStatus || 'N/A',
        'Created At': booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A',
      }));

      console.log('Data to export:', dataToExport); // Debug: check formatted data

      if (dataToExport.length === 0) {
        console.error('No valid data to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(dataToExport[0]);
      let csvContent = headers.join(',') + '\n';

      dataToExport.forEach((item: any) => {
        const row = headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          return stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        });
        csvContent += row.join(',') + '\n';
      });

      console.log('Generated CSV content:', csvContent); // Debug: check CSV content

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-6 mt-5 mx-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Manage all property bookings and visits</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              console.log('Export button clicked (from button)');
              handleExport();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookingData?.filter((u) => u.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">₹{stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="visit">Visit Bookings ({bookings.filter((b) => b.type === "Visit").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Booking List</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Input placeholder="Search bookings..." className="w-64" value={search} onChange={e => setSearch(e.target.value)} />
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
              <BookingTable data={bookingData}
                loading={isLoading}
                totalBookings={totalRecord} totalPages={totalPages} totalRecord={totalRecord} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Visit Booking</CardTitle>
                <div className="flex space-x-2">
                  {/* <div className="relative">
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
                  </Button> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>

              <VisitBookingTable
                data={visitBookingData}                     // ✅ Use the correct visit data
                loading={isLoadingVisit}                   // ✅ Correct loading state
                totalBookings={visitBookingData.length}    // ✅ Displayed in footer or summary
                totalPages={totalPagesVisit}               // ✅ Pagination
                totalRecord={totalVisitRecord}             // ✅ For "Showing X of Y" text
                currentPage={currentPage}                  // ✅ Current page tracking
                setCurrentPage={setCurrentPage}            // ✅ Page change handler
              />

            </CardContent>
          </Card>
        </TabsContent>



      </Tabs>
    </div>
  )
}

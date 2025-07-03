"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { getBookings } from "@/src/services/BookingServices"
import { getVisitBookings } from "@/src/services/BookingServices"
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
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"



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
  const [filters, setFilters] = useState({
    status: "all" as "all" | "confirmed" | "pending" | "completed",
    paymentStatus: "all" as "all" | "pending" | "paid" | "refunded",
    bookingType: "all" as "all" | "room" | "visit",
    dateRange: { from: undefined, to: undefined } as { from?: Date; to?: Date },
    search: ""
  });

  // State for client-side filtered data
  const [selectedTab, setSelectedTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedBookings, setPaginatedBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  useAuthRedirect();

  // Fetch bookings data from API
  const fetchBookings = useCallback(async () => {
    try {
      const response = await getBookings({
        page: 1,
        limit: 10, // Adjust limit as needed or implement pagination
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.paymentStatus !== "all" && { paymentStatus: filters.paymentStatus }),
        ...(filters.bookingType !== "all" && { type: filters.bookingType }),
        ...(filters.dateRange?.from && { startDate: format(filters.dateRange.from, 'yyyy-MM-dd') }),
        ...(filters.dateRange?.to && { endDate: format(filters.dateRange.to, 'yyyy-MM-dd') }),
        ...(filters.search && { search: filters.search }),
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  }, [filters]);
  console.log(paginatedBookings)
  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await getBookings({
          page: 1,
          limit: 10,
        });
        setBookings(response.data || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Apply filters and fetch data when they change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [filters, fetchBookings]);

  // Define Booking type at the top of the file
  type Booking = {
    _id: string;
    id: string;
    user: {
      name: string;
      email: string;
      phone: string;
    };
    property: string;
    room: string;
    type: string;
    status: string;
    amount: number;
    date: string;
    checkIn: string;
    checkOut: string;
    source: string;
    paymentStatus: string;
    duration: string;
    guests: number;
    createdAt: string;
    updatedAt: string;
  };

  // Apply tab filter to the fetched data
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Apply tab filter
    if (selectedTab === "room") {
      result = result.filter(booking => booking.type === "Room");
    } else if (selectedTab === "visit") {
      result = result.filter(booking => booking.type === "Visit");
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }

    return result;
  }, [bookings, selectedTab, statusFilter]);

  // Calculate stats based on filtered bookings
  const stats = useMemo(() => ({
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === "confirmed").length,
    pending: filteredBookings.filter((b) => b.status === "pending").length,
    completed: filteredBookings.filter((b) => b.status === "completed").length,
    revenue: filteredBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.amount || 0), 0),
  }), [filteredBookings])



  // Pagination effect
  useEffect(() => {
    const total = filteredBookings.length;
    setTotalRecord(total);
    setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

    const paginated = filteredBookings.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    setPaginatedBookings(paginated);
  }, [filteredBookings, currentPage]);

  // visitbookin

  // ----------- Visit Booking API -----------
  const fetchVisitBooking = useCallback(() => {
    const payload: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(search && { search }),
      ...(statusFilter !== "all" && { status: statusFilter }),
    };
    return getVisitBookings(payload);
  }, [currentPage, search, statusFilter]);

  const handleApplyFilters = () => {
    // Reset to first page when filters change
    setCurrentPage(1);
    fetchBookings();
  }
  const {
    data: dataVisitBooking,
    isLoading: isLoadingVisit,
    isError: isErrorVisit,
    refetch: refetchVisit,
  } = useQuery({
    queryKey: [currentPage, search, statusFilter],
    queryFn: fetchVisitBooking,
  });

  const visitBookingData = dataVisitBooking?.data || [];
  const totalPagesVisit = dataVisitBooking?.page || 1;
  const totalVisitRecord = dataVisitBooking?.total || 0;

  console.log("visit booking", visitBookingData)
  console.log("total page", totalPagesVisit, totalVisitRecord)
  const handleClearFilters = () => {
    setFilters({
      status: "all",
      paymentStatus: "all",
      bookingType: "all",
      dateRange: { from: undefined, to: undefined },
      search: ""
    });
    // Reset to first page when clearing filters
    setCurrentPage(1);
  };
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
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(stats.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Bookings ({filteredBookings.length})</TabsTrigger>
          <TabsTrigger value="visit">Visit Bookings ({filteredBookings.filter((b) => b.type === "Visit").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Booking List</CardTitle>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search bookings..."
                    className="w-64"
                    value={filters.search}
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleApplyFilters();
                      }
                    }}
                  />
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
                  >
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={Object.values(filters).some(filter =>
                        (typeof filter === 'object' ?
                          Object.values(filter).some(Boolean) :
                          filter !== 'all' && filter !== ''
                        )
                        ) ? "bg-primary/10 border-primary" : ""}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        {Object.values(filters).some(filter =>
                        (typeof filter === 'object' ?
                          Object.values(filter).some(Boolean) :
                          filter !== 'all' && filter !== ''
                        )
                        ) ? "Filters Applied" : "Filter"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Filter Bookings</DialogTitle>
                        <DialogDescription className="text-sm">Apply filters to narrow down bookings.</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* Search */}
                        <div>
                          <Label>Search</Label>
                          <Input
                            placeholder="Search bookings..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Payment Status */}
                        <div>
                          <Label>Payment Status</Label>
                          <Select
                            value={filters.paymentStatus}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Payment status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Payments</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="unpaid">Unpaid</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Booking Type */}
                        <div>
                          <Label>Booking Type</Label>
                          <Select
                            value={filters.bookingType}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, bookingType: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Booking type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="room">Room Booking</SelectItem>
                              <SelectItem value="visit">Visit Booking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Date Range */}
                        <div>
                          <Label>Date Range</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filters.dateRange?.from ? (
                                  filters.dateRange.to ? (
                                    <>
                                      {format(filters.dateRange.from, "MMM dd, yyyy")} -{" "}
                                      {format(filters.dateRange.to, "MMM dd, yyyy")}
                                    </>
                                  ) : (
                                    format(filters.dateRange.from, "MMM dd, yyyy")
                                  )
                                ) : (
                                  <span>Pick a date range</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={filters.dateRange?.from}
                                selected={filters.dateRange}
                                onSelect={(range) => setFilters(prev => ({ ...prev, dateRange: range || { from: undefined, to: undefined } }))}
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="mr-2"
                          >
                            Clear All
                          </Button>

                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <BookingTable
                data={paginatedBookings.map((booking: any) => ({
                  _id: booking.id,
                  fullName: booking?.fullName || 'N/A',
                  email: booking?.email || 'N/A',
                  phoneNumber: booking?.phoneNumber || 'N/A',
                  guests: 1,
                  property: booking?.property || 'N/A',
                  gender: booking?.gender || 'N/A',
                  checkIn: booking?.checkIn,
                  checkOut: booking?.checkOut,
                  sharing: booking?.sharing || 'N/A',
                  totalAmount: booking?.totalAmount || 0,
                  paymentStatus: booking?.paymentStatus || 'pending',
                  status: booking?.status || 'pending',
                  createdAt: booking?.createdAt || new Date().toISOString(),
                }))}
                loading={isLoading}
                totalBookings={totalRecord}
                totalPages={totalPages}
                totalRecord={totalRecord}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
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

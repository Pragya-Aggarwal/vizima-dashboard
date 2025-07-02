"use client"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useSearch } from "../contexts/SearchContext"
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Star,
  MapPin,
  BadgeDollarSign,
  CheckCircle,
  XCircle,
  CalendarCheck,
  CalendarX2,
  ShieldCheck,
  UserCheck,
  UserX,
  User,
  Clock
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
// Use consistent casing for service imports
import { getDashboardService } from "@/src/services/dashboard"
import { useAuthRedirect } from "@/hooks/use-Redirect"
// Use the correct casing that matches the actual file name
import { getBookingStats } from "@/src/services/BookingServices"
import { getPropertyStats } from "@/src/services/propertyService"

type DashboardData = {
  totalProperties: number;
  totalAgents: number;
  adminUsers: number;
  totalUsers: number;
  regularUsers: number;
  unverifiedUsers: number;
  verifiedUsers: number;
  recentRegistrations: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  overview?: {
    totalProperties?: number;
    availableProperties?: number;
    averagePrice?: number;
    totalViews?: number;
  };
};

const dashboardStats = {
  totalProperties: { value: 24, change: "+2", trend: "up" },
  totalUsers: { value: 1567, change: "+89", trend: "up" },
  todayBookings: { value: 12, change: "+3", trend: "up" },
  weeklyBookings: { value: 89, change: "+15", trend: "up" },
  lifetimeBookings: { value: 2456, change: "+234", trend: "up" },
  vizimaBookings: { value: 1890, percentage: 77 },
  rentokBookings: { value: 566, percentage: 23 },
  monthlyRevenue: { value: 892000, change: "+18%", trend: "up" },
  validLeads: { value: 234, change: "+12", trend: "up" },
  spamLeads: { value: 45, change: "-8", trend: "down" },
  occupancyRate: { value: 87.5, change: "-2.1%", trend: "down" },
}

const recentBookings = [
  {
    id: "BK001",
    user: "John Doe",
    property: "Sunrise PG",
    room: "A-101",
    type: "Room",
    status: "confirmed",
    amount: 8500,
    date: "2024-01-15",
    source: "Vizima",
  },
  {
    id: "BK002",
    user: "Sarah Wilson",
    property: "Green Valley Hostel",
    room: "Visit",
    type: "Visit",
    status: "pending",
    amount: 0,
    date: "2024-01-16",
    source: "RentOk",
  },
  {
    id: "BK003",
    user: "Mike Johnson",
    property: "City Center PG",
    room: "C-301",
    type: "Room",
    status: "confirmed",
    amount: 9800,
    date: "2024-01-14",
    source: "Vizima",
  },
]

const topProperties = [
  { name: "Sunrise PG", occupancy: 95, revenue: "₹2,45,000", rating: 4.8, city: "Mumbai" },
  { name: "Green Valley Hostel", occupancy: 87, revenue: "₹1,89,000", rating: 4.6, city: "Pune" },
  { name: "City Center PG", occupancy: 92, revenue: "₹3,12,000", rating: 4.9, city: "Delhi" },
  { name: "Metro Heights", occupancy: 78, revenue: "₹1,56,000", rating: 4.4, city: "Bangalore" },
]

// Define Property type for type safety
interface Property {
  id: string;
  name: string;
  occupancy: number;
  revenue: string;
  rating: number;
  city: string;
};

type Booking = {
  id: string;
  user: string;
  property: string;
  room: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
  amount: number;
  source: string;
  date: string;
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [bookingData, setBookingData] = useState<DashboardData | null>(null);
  const [propertyData, setPropertyData] = useState<DashboardData | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [topProperties] = useState<Property[]>([
    { id: '1', name: "Sunrise PG", occupancy: 95, revenue: "₹2,45,000", rating: 4.8, city: "Mumbai" },
    { id: '2', name: "Green Valley Hostel", occupancy: 87, revenue: "₹1,89,000", rating: 4.6, city: "Pune" },
    { id: '3', name: "City Center PG", occupancy: 92, revenue: "₹3,12,000", rating: 4.9, city: "Delhi" },
  ]);

  const { searchQuery } = useSearch();

  console.log("bookingDta", bookingData)
  console.log("propertydata", propertyData)


  useAuthRedirect();

  // Initialize properties and bookings
  useEffect(() => {
    setAllProperties([
      { id: '1', name: "Sunrise PG", occupancy: 95, revenue: "₹2,45,000", rating: 4.8, city: "Mumbai" },
      { id: '2', name: "Green Valley Hostel", occupancy: 87, revenue: "₹1,89,000", rating: 4.6, city: "Pune" },
      { id: '3', name: "City Center PG", occupancy: 92, revenue: "₹3,12,000", rating: 4.9, city: "Delhi" },
      { id: '4', name: "Metro Heights", occupancy: 78, revenue: "₹1,56,000", rating: 4.4, city: "Bangalore" },
    ]);

    // Mock recent bookings data
    setRecentBookings([
      {
        id: 'b1',
        user: 'John Doe',
        property: 'Sunrise PG',
        room: 'Deluxe Room',
        type: 'Monthly',
        status: 'confirmed',
        amount: 15000,
        source: 'Website',
        date: '2023-06-15',
      },
      {
        id: 'b2',
        user: 'Jane Smith',
        property: 'Green Valley',
        room: 'Shared Dorm',
        type: 'Weekly',
        status: 'pending',
        amount: 5000,
        source: 'Mobile App',
        date: '2023-06-14',
      },
    ]);

    handleDashboard();
  }, [])

  const handleDashboard = async () => {
    try {
      const responce = await getDashboardService()
      const bookingResponce = await getBookingStats()
      const propertyResponce = await getPropertyStats()
      console.log("get Booking Stats", bookingResponce)
      console.log("responce", responce)
      setDashboardData(responce?.data)
      setBookingData(bookingResponce?.data)
      setPropertyData(propertyResponce?.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Filter properties based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = allProperties.filter(property => 
        property?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(allProperties);
    }
  }, [searchQuery, allProperties]);

  const displayProperties = searchQuery ? filteredProperties || [] : allProperties || [];

  return (
    <div className="space-y-6 mt-5 mx-5">
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredProperties?.length || 0} properties matching "{searchQuery}"
        </div>
      )}
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Total Bookings */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{bookingData?.totalBookings}</div>
          </CardContent>
        </Card>

        {/* Pending Bookings */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{bookingData?.pendingBookings}</div>
          </CardContent>
        </Card>

        {/* Confirmed Bookings */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{bookingData?.confirmedBookings}</div>
          </CardContent>
        </Card>

        {/* Completed Bookings */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-500">{bookingData?.completedBookings}</div>
          </CardContent>
        </Card>

        {/* Cancelled Bookings */}
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{bookingData?.cancelledBookings}</div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">₹{bookingData?.totalRevenue}</div>
          </CardContent>
        </Card>
        {/* Total Properties */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{propertyData?.totalProperties || 0}</div>
          </CardContent>
        </Card>

        {/* Available Properties */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Properties</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {propertyData?.overview?.availableProperties !== undefined 
                ? propertyData.overview.availableProperties 
                : (propertyData?.totalProperties || 0) - (propertyData?.totalBookings || 0)
              }
            </div>
          </CardContent>
        </Card>

        {/* Average Price */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {propertyData?.overview?.averagePrice 
                ? `₹${propertyData.overview.averagePrice.toFixed(0)}` 
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{propertyData?.overview?.totalViews || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData?.totalUsers}</div>
          </CardContent>
        </Card>

        {/* admin user */}
        {/* <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.adminUsers}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p>
          </CardContent>
        </Card> */}

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardData?.adminUsers}</div>
            {/* <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p> */}
          </CardContent>
        </Card>


        {/* verified user */}

        {/* <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified User</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.verifiedUsers}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p>
          </CardContent>
        </Card> */}


        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified User</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData?.verifiedUsers}</div>
            {/* <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p> */}
          </CardContent>
        </Card>



        {/* unverified user */}


        {/* <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unverified User</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.unverifiedUsers}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p>
          </CardContent>
        </Card> */}


        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unverified User</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardData?.unverifiedUsers}</div>
            {/* <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p> */}
          </CardContent>
        </Card>


        {/* regular user */}

        {/* <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regualar User</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.regularUsers}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p>
          </CardContent>
        </Card> */}


        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Regular User</CardTitle>
            <User className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{dashboardData?.regularUsers}</div>
            {/* <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p> */}
          </CardContent>
        </Card>

        {/* recent registration */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Registration</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData?.recentRegistrations}</div>
            {/* <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {dashboardStats.totalUsers.change} this week
            </p> */}
          </CardContent>
        </Card>

      </div>

      {/* Booking Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Today</span>
              <span className="font-semibold">{dashboardStats.todayBookings.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">This Week</span>
              <span className="font-semibold">{dashboardStats.weeklyBookings.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Lifetime</span>
              <span className="font-semibold">{dashboardStats.lifetimeBookings.value.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Total Booking</span>
                <span className="font-semibold">{bookingData?.pendingBookings}</span>
              </div>
              <Progress value={bookingData?.pendingBookings} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Total Property</span>
                <span className="font-semibold">{propertyData?.overview?.totalProperties}</span>
              </div>
              <Progress value={propertyData?.overview?.totalProperties} className="h-2" />
            </div>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">Valid Leads</span>
              <span className="font-semibold text-green-600">{dashboardStats.validLeads.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600">Spam Leads</span>
              <span className="font-semibold text-red-600">{dashboardStats.spamLeads.value}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="font-semibold">
                  {Math.round(
                    (dashboardStats.validLeads.value /
                      (dashboardStats.validLeads.value + dashboardStats.spamLeads.value)) *
                    100,
                  )}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest property bookings and reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {booking.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{booking.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.property} - {booking.room}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {booking.source}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {booking.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {booking.amount > 0 && (
                    <p className="text-sm font-medium">₹{booking.amount.toLocaleString()}</p>
                  )}
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "default"
                        : booking.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Properties with highest occupancy and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{property.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{property.occupancy}% occupied</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {property.rating}
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.city}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{property.revenue}</p>
                    <p className="text-xs text-muted-foreground">this month</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>API health and system warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Payment Gateway</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Online
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">RentOk Sync</p>
                  <p className="text-xs text-muted-foreground">Last sync: 2 hours ago</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Database Backup</p>
                  <p className="text-xs text-muted-foreground">Scheduled in 2 hours</p>
                </div>
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

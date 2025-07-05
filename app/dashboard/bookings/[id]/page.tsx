"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getVisitBookingById } from "@/src/services/BookingServices"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarIcon, Clock, Mail, MapPin, Phone, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"

interface VisitBooking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  property: {
    _id: string;
    title: string;
    location: string;
    type: string;
    bedrooms?: number;
    bathrooms?: number;
  };
  visitDate: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export default function VisitBookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string

  const { data: booking, isLoading, isError } = useQuery<{ data: { visitBooking: VisitBooking } }>({
    queryKey: ["visit-booking", bookingId],
    queryFn: () => getVisitBookingById(bookingId),
    enabled: !!bookingId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingIndicator />
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load booking details. Please try again later.
        </div>
      </div>
    )
  }

  const bookingData = booking?.data?.visitBooking
  const property = bookingData?.property
  const user = {
    name: bookingData?.name,
    email: bookingData?.email,
    phone: bookingData?.phone
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={bookingData?.status === 'confirmed' ? 'default' : 'secondary'}>
            {bookingData?.status?.toUpperCase() || 'PENDING'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Visit Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-mono text-sm">{bookingData?._id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Booking Date</p>
                <p className="font-medium">
                  {bookingData?.createdAt ? format(new Date(bookingData.createdAt), 'PPPp') : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Visit Date & Time</p>
                <p className="font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {bookingData?.visitDate ? format(new Date(bookingData.visitDate), 'PPPp') : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={
                  bookingData?.status === 'confirmed' ? 'default' : 
                  bookingData?.status === 'cancelled' ? 'destructive' : 'secondary'
                }>
                  {bookingData?.status?.toUpperCase() || 'PENDING'}
                </Badge>
              </div>
              {bookingData?.message && (
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {bookingData.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          {property && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Property Name</p>
                  <p className="font-medium">{property.title || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.location || 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{property.type || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Rooms</p>
                  <p className="font-medium">
                    {property.bedrooms || 0} Beds • {property.bathrooms || 0} Baths
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Guest Details</h2>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{user?.name || 'N/A'}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user?.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                disabled={bookingData?.status === 'completed' || bookingData?.status === 'cancelled'}
              >
                <Clock className="h-4 w-4" />
                Mark as Completed
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                disabled={bookingData?.status === 'cancelled'}
              >
                <Mail className="h-4 w-4" />
                Send Reminder
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                disabled={bookingData?.status === 'cancelled'}
              >
                <span className="text-lg">×</span>
                Cancel Visit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

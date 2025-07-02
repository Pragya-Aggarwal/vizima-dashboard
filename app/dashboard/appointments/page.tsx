"use client"

import { useState } from "react"
import {
  Clock,
  Calendar,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const appointments = [
  {
    id: "APT001",
    user: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
    },
    property: "Sunrise PG",
    city: "Mumbai",
    date: "2024-01-18",
    time: "10:00 AM",
    status: "confirmed",
    type: "property_visit",
    notes: "Interested in single room with AC",
    createdAt: "2024-01-15",
  },
  {
    id: "APT002",
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+91 9876543211",
    },
    property: "Green Valley Hostel",
    city: "Pune",
    date: "2024-01-19",
    time: "2:00 PM",
    status: "pending",
    type: "property_visit",
    notes: "Looking for shared accommodation",
    createdAt: "2024-01-16",
  },
  {
    id: "APT003",
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+91 9876543212",
    },
    property: "City Center PG",
    city: "Delhi",
    date: "2024-01-17",
    time: "11:30 AM",
    status: "completed",
    type: "property_visit",
    notes: "Visited and booked room C-301",
    createdAt: "2024-01-14",
  },
  {
    id: "APT004",
    user: {
      name: "Emma Davis",
      email: "emma@example.com",
      phone: "+91 9876543213",
    },
    property: "Metro Heights",
    city: "Bangalore",
    date: "2024-01-20",
    time: "3:30 PM",
    status: "cancelled",
    type: "property_visit",
    notes: "User cancelled due to location",
    createdAt: "2024-01-13",
  },
]

const timeSlots = [
  { city: "Mumbai", date: "2024-01-18", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"] },
  { city: "Pune", date: "2024-01-19", slots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"] },
  { city: "Delhi", date: "2024-01-20", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"] },
]

function CreateSlotDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Slots
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Visit Slots</DialogTitle>
          <DialogDescription>Create new appointment slots for property visits</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Slot Interval (minutes)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Create Slots</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AppointmentDetailsDialog({ appointment }: { appointment: (typeof appointments)[0] }) {
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
          <DialogTitle>Appointment Details - {appointment.id}</DialogTitle>
          <DialogDescription>Complete appointment information and management options</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {appointment.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.user.name}</p>
                    <p className="text-sm text-muted-foreground">{appointment.user.email}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p>{appointment.user.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Property:</span>
                  <span className="font-medium">{appointment.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">City:</span>
                  <span className="font-medium">{appointment.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="font-medium">{appointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="font-medium">{appointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : appointment.status === "completed"
                          ? "default"
                          : appointment.status === "pending"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{appointment.notes}</p>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
              {appointment.status === "pending" && (
                <Button variant="default">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AppointmentsPage() {
  const [selectedTab, setSelectedTab] = useState("appointments")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter !== "all" && appointment.status !== statusFilter) return false
    return true
  })

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  }

  // Add this handler function in your AppointmentsPage component
const handleExportAppointments = () => {
  try {
    console.log('Export appointments button clicked');
    console.log('Appointments data:', appointments); // Debug log

    if (!appointments || appointments.length === 0) {
      console.error('No appointments data available');
      return;
    }

    // Format appointments data for export
    const dataToExport = appointments.map(appointment => ({
      'Appointment ID': appointment.id || 'N/A',
      'Property': appointment.property || 'N/A',
      'Date': appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A',
      'Time': appointment.time || 'N/A',
      'Status': appointment.status || 'N/A',
      'Customer Name': appointment.user.name || 'N/A',
      'Customer Email': appointment.user.email || 'N/A',
      'Customer Phone': appointment.user.phone || 'N/A',
      'Notes': appointment.notes || 'N/A',
      'Created At': appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : 'N/A',
    }));

    console.log('Data to export:', dataToExport);

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

    console.log('Generated CSV content:', csvContent);

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_export_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h2 className="text-2xl font-bold">Appointment Slot Manager</h2>
          <p className="text-muted-foreground">Manage property visit appointments and time slots</p>
        </div>
        <div className="flex space-x-2">
        <Button 
  variant="outline" 
  onClick={handleExportAppointments}
>
  <Download className="h-4 w-4 mr-2" />
  Export
</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
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
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
          <TabsTrigger value="slots">Time Slots ({timeSlots.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Appointment List</CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search appointments..." className="w-64" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Appointment ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">{appointment.id}</div>
                        <div className="text-xs text-muted-foreground">Created: {appointment.createdAt}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {appointment.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.user.name}</p>
                            <p className="text-xs text-muted-foreground">{appointment.user.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.property}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {appointment.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.status === "confirmed" || appointment.status === "completed"
                              ? "default"
                              : appointment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {appointment.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {appointment.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {appointment.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {appointment.status === "cancelled" && <XCircle className="h-3 w-3 mr-1" />}
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground truncate max-w-32">{appointment.notes}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <AppointmentDetailsDialog appointment={appointment} />
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {appointment.status === "pending" && (
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

        <TabsContent value="slots" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Available Time Slots</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <CreateSlotDialog />
                </div>
              </div>
              <CardDescription>Manage city-wise appointment slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeSlots.map((citySlot, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {citySlot.city} - {citySlot.date}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slot
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-6 gap-2">
                        {citySlot.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="p-2 border rounded-lg text-center text-sm bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                          >
                            <Clock className="h-3 w-3 mx-auto mb-1" />
                            {slot}
                            <div className="text-xs text-muted-foreground">Available</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

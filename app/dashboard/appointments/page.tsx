"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Clock,
  Calendar,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  RefreshCw,
  MapPin,
  CheckCircle,
  XCircle,
  Trash,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogClose, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getScheduleVisits, getScheduleVisitById, updateScheduleVisit, deleteScheduleVisit, ScheduleVisit, GetScheduleVisitsParams, UpdateScheduleVisitData } from "../../../src/services/ScheduleVisitService"
import { FilterDialog } from "../../../src/components/appointments/FilterDialog"
import { useToast } from "@/components/ui/use-toast"

type TimeSlot = {
  _id: string;
  city: string;
  date: string;
  startTime: string;
  endTime: string;
  maxVisitors: number;
  currentVisitors: number;
  slots: string[];
};

const cityTimeSlots: TimeSlot[] = [
  {
    id: '1',
    city: 'Mumbai',
    date: '2024-01-18',
    startTime: '09:00',
    endTime: '17:00',
    maxVisitors: 10,
    currentVisitors: 5,
    slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  },
  {
    id: '2',
    city: 'Pune',
    date: '2024-01-19',
    startTime: '09:00',
    endTime: '17:00',
    maxVisitors: 8,
    currentVisitors: 3,
    slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  },
  {
    id: '3',
    city: 'Delhi',
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '17:00',
    maxVisitors: 12,
    currentVisitors: 4,
    slots: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM']
  }
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

function AppointmentDetailsDialog({ appointment }: { appointment: ScheduleVisit }) {
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
          <DialogTitle>Appointment Details - {appointment._id}</DialogTitle>
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
                      {appointment?.fullName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || 'NA'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment?.fullName || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">{appointment?.email || 'N/A'}</p>
                  </div>
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
                  <span className="font-medium">{appointment.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="font-medium">{appointment?.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sharing:</span>
                  <Badge
                    variant={
                      appointment.sharing === "single"
                        ? "default"
                        : appointment.sharing === "double"
                          ? "default"
                          : appointment.sharing === "triple"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {appointment.sharing}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>



          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>

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

// Edit Appointment Dialog Component
function EditAppointmentDialog({ appointment, onSave }: { appointment: ScheduleVisit; onSave: (updatedAppointment: ScheduleVisit) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<UpdateScheduleVisitData>({
    sharing: appointment.sharing,
    date: appointment?.date,
    visitTime: appointment.visitTime,
    gender: appointment.gender,
    propertyName: appointment.propertyName,
    fullName: appointment.fullName,
    email: appointment.email,
    mode: appointment.mode,
  })


  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedAppointment = await updateScheduleVisit(appointment._id, formData)
      onSave(updatedAppointment)
      setOpen(false)
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>Update appointment details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Visit Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData?.date?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  value={formData.propertyName || ''}
                  onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  placeholder="Enter property name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sharing">Sharing</Label>
                <Select value={formData.sharing} onValueChange={(value) => setFormData({ ...formData, sharing: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sharing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirmation Dialog Component
function DeleteConfirmationDialog({ appointment, onDelete }: { appointment: ScheduleVisit; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteScheduleVisit(appointment._id)
      onDelete()
      setOpen(false)
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Appointment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Appointment Details:</strong>
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {appointment.fullName} - {appointment.propertyName}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Date: {appointment.date}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("appointments");
  const [appointments, setAppointments] = useState<ScheduleVisit[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Omit<GetScheduleVisitsParams, 'page' | 'limit'>>({});
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sharingFilter, setSharingFilter] = useState('all');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(cityTimeSlots);

  // Fetch appointments from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const params: GetScheduleVisitsParams = {
          ...filters,
          page: 1,
          limit: 50,
          search: search || undefined, // Add search to API params
        }
        const res = await getScheduleVisits(params)
        setAppointments(res.data)
        setStats({
          total: res.total,
          confirmed: res.data.filter((a: ScheduleVisit) => a.sharing === "single").length,
          pending: res.data.filter((a: ScheduleVisit) => a.sharing === "double").length,
          completed: res.data.filter((a: ScheduleVisit) => a.sharing === "triple").length,
          cancelled: 0, // Not using status-based filtering
          no_show: 0, // Not using status-based filtering
        })
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch appointments')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filters, sharingFilter, search])

  // Filter dialog handlers
  const handleFilterChange = (newFilters: Omit<GetScheduleVisitsParams, 'page' | 'limit'>) => {
    setFilters(newFilters)
  }
  const handleResetFilters = () => {
    setFilters({ propertyId: '', userId: '', dateFrom: '', dateTo: '', search: '' })
  }
  const handleApplyFilters = () => {
    setFilterDialogOpen(false)
  }

  // Handle appointment deletion
  const handleDeleteAppointment = (deletedAppointmentId: string) => {
    setAppointments(appointments.filter(apt => apt._id !== deletedAppointmentId))
  }

  // Filter appointments based on search and status
  const filteredAppointments = useMemo(() => {
    let result = [...appointments]

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase()
      result = result.filter((appointment: ScheduleVisit) =>
      (appointment?.fullName?.toLowerCase().includes(searchTerm) ||
        appointment?.email?.toLowerCase().includes(searchTerm) ||
        appointment?.propertyName?.toLowerCase().includes(searchTerm) ||
        appointment._id?.toLowerCase().includes(searchTerm))
      )
    }

    // Apply sharing filter
    if (sharingFilter && sharingFilter !== 'all') {
      result = result.filter(appointment => appointment.sharing === sharingFilter)
    }

    return result
  }, [appointments, search, sharingFilter])

  // Export appointments to CSV
  const handleExportAppointments = () => {
    try {
      if (!filteredAppointments || filteredAppointments.length === 0) {
        toast({
          title: 'No data to export',
          description: 'There are no appointments to export.',
          variant: 'destructive',
        });
        return;
      }

      // Format appointments data for export with proper type safety
      const dataToExport = filteredAppointments.map((appointment: ScheduleVisit) => {
        const date = appointment?.date
          ? new Date(appointment?.date).toLocaleDateString()
          : 'N/A';

        const createdAt = appointment.createdAt
          ? new Date(appointment.createdAt).toLocaleString()
          : 'N/A';

        return {
          'Appointment ID': appointment._id || 'N/A',
          'Property': appointment.propertyName || 'N/A',
          'Date': date,
          'Sharing': appointment.sharing?.toUpperCase() || 'N/A',
          'Customer Name': appointment.fullName || 'N/A',
          'Customer Email': appointment.email || 'N/A',
          'Created At': createdAt,
        };
      });



      if (dataToExport.length === 0) {
        console.error('No valid data to export');
        return;
      }

      // Convert to CSV with proper type safety
      if (dataToExport.length === 0) return;

      const headers = Object.keys(dataToExport[0]) as Array<keyof typeof dataToExport[0]>;
      let csvContent = headers.join(',') + '\n';

      dataToExport.forEach((item) => {
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
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

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
          <TabsTrigger value="slots">Time Slots ({cityTimeSlots.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Appointment List</CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search appointments..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Select value={sharingFilter} onValueChange={setSharingFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sharing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sharing</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <TableHead>sharing</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{appointment?._id}</div>
                        <div className="text-xs text-muted-foreground">Created: {new Date(appointment?.createdAt).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {appointment?.fullName
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || 'NA'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment?.fullName || 'Unknown User'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.propertyName || 'Unknown Property'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {appointment?.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.sharing === "single"
                              ? "default"
                              : appointment.sharing === "double"
                                ? "destructive"
                                : appointment.sharing === "triple"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {appointment.sharing === "single" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {appointment.sharing === "double" && <Clock className="h-3 w-3 mr-1" />}
                          {appointment.sharing === "triple" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {appointment.sharing}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-1">
                          <AppointmentDetailsDialog key={`details-${appointment._id}`} appointment={appointment} />
                          <EditAppointmentDialog
                            key={`edit-${appointment._id}`}
                            appointment={appointment}
                            onSave={(updatedAppointment) => {
                              setAppointments(appointments.map(apt =>
                                apt._id === updatedAppointment._id ? updatedAppointment : apt
                              ))
                            }}
                          />
                          <DeleteConfirmationDialog
                            key={`delete-${appointment._id}`}
                            appointment={appointment}
                            onDelete={() => handleDeleteAppointment(appointment._id)}
                          />
                          {appointment.sharing === "single" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
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
                {cityTimeSlots.map((citySlot) => (
                  <Card key={`${citySlot.city}-${citySlot.date}`}>
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
                        {citySlot.slots.map((slot, index) => (
                          <div
                            key={`${citySlot.city}-${citySlot.date}-slot-${index}`}
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

"use client"
// dynamic
import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"


import { Label } from "@/components/ui/label"
import {
  Filter,
  Download,
  Eye,
  Edit,
  Shield,
  ShieldCheck,
  ShieldX,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Search,
  Trash,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// 
import { deleteUserbyId, getUsers } from "@/src/services/User"
import { get } from "http"
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import DetailModal from "@/src/components/User/DetailModal/detailModal"
import { DeleteModal } from "@/src/common/DeleteModal/deleteModal"
import UpdateModal from "@/src/components/User/UpdateModal/updateModal"
import { SchemaFormData } from "@/src/components/City/Schema/schema"
import { toast } from "sonner"
import { updateUserById } from "@/src/services/User"
import Pagination from "@/src/common/pagination/pagination"
import { useAuthRedirect } from "@/hooks/use-Redirect"

const users = [
  {
    id: "U001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    city: "Mumbai",
    area: "Andheri West",
    status: "verified",
    tag: "Lead",
    bookings: 3,
    totalSpent: 25500,
    joinDate: "2024-01-10",
    lastActive: "2024-01-15",
    documents: {
      aadhar: true,
      pan: false,
      photo: true,
    },
    preferences: {
      budget: "10000-15000",
      roomType: "Single",
      amenities: ["WiFi", "AC", "Food"],
    },
  },
  {
    id: "U002",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+91 9876543211",
    city: "Pune",
    area: "Koregaon Park",
    status: "active",
    tag: "Verified",
    bookings: 1,
    totalSpent: 8500,
    joinDate: "2024-01-12",
    lastActive: "2024-01-16",
    documents: {
      aadhar: true,
      pan: true,
      photo: true,
    },
    preferences: {
      budget: "8000-12000",
      roomType: "Shared",
      amenities: ["WiFi", "Gym"],
    },
  },
  {
    id: "U003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+91 9876543212",
    city: "Delhi",
    area: "CP",
    status: "blocked",
    tag: "Spam",
    bookings: 0,
    totalSpent: 0,
    joinDate: "2024-01-08",
    lastActive: "2024-01-09",
    documents: {
      aadhar: false,
      pan: false,
      photo: false,
    },
    preferences: {
      budget: "5000-8000",
      roomType: "Any",
      amenities: [],
    },
  },
  {
    id: "U004",
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+91 9876543213",
    city: "Bangalore",
    area: "Whitefield",
    status: "verified",
    tag: "Premium",
    bookings: 5,
    totalSpent: 47500,
    joinDate: "2023-12-15",
    lastActive: "2024-01-16",
    documents: {
      aadhar: true,
      pan: true,
      photo: true,
    },
    preferences: {
      budget: "15000-20000",
      roomType: "Single",
      amenities: ["WiFi", "AC", "Parking", "Gym"],
    },
  },
]

function UserDetailsDialog({ user }: { user: (typeof users)[0] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile - {user.name}</DialogTitle>
          <DialogDescription>Complete user information and management options</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{user.name}</p>
                      <Badge
                        variant={
                          user.status === "verified"
                            ? "default"
                            : user.status === "blocked"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {user.city}, {user.area}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined {user.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">User Tag:</span>
                    <Badge variant="outline">{user.tag}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Bookings:</span>
                    <span className="font-medium">{user.bookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Spent:</span>
                    {/* <span className="font-medium">₹{user.totalSpent.toLocaleString()}</span> */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Active:</span>
                    <span className="font-medium">{user.lastActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">User ID:</span>
                    <span className="font-mono text-sm">{user.id}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>All bookings made by this user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Booking history will be displayed here</p>
                  <p className="text-sm">Total bookings: {user.bookings}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>User uploaded documents and verification status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Aadhar Card</span>
                    </div>
                    {user.documents.aadhar ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">PAN Card</span>
                    </div>
                    {user.documents.pan ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Photo</span>
                    </div>
                    {user.documents.photo ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Accommodation preferences and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Budget Range</Label>
                    <p className="text-sm text-muted-foreground">₹{user.preferences.budget}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Room Type</Label>
                    <p className="text-sm text-muted-foreground">{user.preferences.roomType}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Preferred Amenities</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.preferences.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
          <div className="space-x-2">
            {user.status !== "blocked" ? (
              <Button variant="destructive" size="sm">
                <ShieldX className="h-4 w-4 mr-2" />
                Block User
              </Button>
            ) : (
              <Button variant="default" size="sm">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Unblock User
              </Button>
            )}
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function UsersPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  useAuthRedirect();

  // Add debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // dynamic
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10;
  const [open, setOpen] = useState(false)
  const [testimonialId, setTestimonialId] = useState<string | null | undefined>();
  const [detailModalopen, setDetailModalOpen] = useState(false)
  const [updateopen, setUpdateOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)





  const handleDetailModal = async (id: string) => {

    setDetailModalOpen(true)
    setTestimonialId(id)
  }



  const handleUpdateModalOpen = (id: string) => {
    setUpdateOpen(true)
    setTestimonialId(id)
  }


  const handleUpdate = async (
    data: SchemaFormData,
    onSuccess: () => void
  ) => {
    try {
      if (!testimonialId) {
        toast.error("User ID is missing");
        return;
      }
      const res = await updateUserById(testimonialId, data)
      toast.success("User updated successfully.");
      onSuccess();
      setUpdateOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
  };








  const fetchUsers = useCallback(() => {
    const payload: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(search && { search }),
    };
    return getUsers(payload);
  }, [currentPage, search]);


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [currentPage, search],
    queryFn: fetchUsers,
  });




  const userData = data?.data || [];
  const totalPages = data?.pagination?.totalPages;
  const totalRecord = data?.pagination?.totalUsers;



  const filteredUsers = userData
    .filter((user: any) => statusFilter === "all" || (user.isVerified == true ? "verified" === statusFilter.toLowerCase() : "unverified" === statusFilter.toLowerCase()))
    .filter((user: any) => tagFilter === "all" || (user.role && user.role.toLowerCase() === tagFilter.toLowerCase()));

  const handleDelete = async () => {
    try {
      const res = await deleteUserbyId(testimonialId as string);
      toast.success("User deleted successfully");
      refetch();
      setDeleteModal(false);
    } catch (error) {
      toast.error("Something went wrong while deleting city");
      console.error("Delete error:", error);
    }
  };


  const handleDeleteModalOpen = (id: string) => {
    setDeleteModal(true)
    setTestimonialId(id)
  }



  // Add this handler function in your UsersPage component
  const handleExportUsers = () => {
    try {

      if (!users || users.length === 0) {
        console.error('No users data available');
        return;
      }

      // Format users data for export
      const dataToExport = users.map(user => ({
        'User ID': user.id || 'N/A',
        'Name': user.name || 'N/A',
        'Email': user.email || 'N/A',
        'Phone': user.phone || 'N/A',
        'Role': user.tag || 'N/A',
        'Status': user.status || 'N/A',
        'Created At': user.joinDate ? new Date(user.joinDate).toLocaleString() : 'N/A',
        'Last Login': user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never',
      }));



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



      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage registered users and their data</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExportUsers}
            disabled={!users || users.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalRecord}</div>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{userData?.filter((u: any) => u.status === "verified").length}</div>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{userData?.filter((u: any) => u.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{userData?.filter((u: any) => u.status === "blocked").length}</div>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {/* <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</div> */}
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User List</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User & Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <div className="flex justify-center items-center gap-2">
                      <LoadingIndicator />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground text-sm">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: any) => (
                  <TableRow key={user?._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user?.name
                              ?.split(" ")
                              ?.map((n: any) => n[0])
                              ?.join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {user?._id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {user?.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {user?.phone}
                        </div>
                      </div>
                    </TableCell>




                    <TableCell>
                      <Badge variant={user?.isVerified ? "default" : "secondary"}>
                        {user?.isVerified ? (
                          <>
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <ShieldX className="h-3 w-3 mr-1" />
                            Not Verified
                          </>
                        )}
                      </Badge>
                    </TableCell>


                    <TableCell>
                      <p className="font-medium">{user?.role == "user" ? "User" : "Admin"}</p>
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" title="View Details" onClick={(() => handleDetailModal(user?._id))}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit" onClick={(() => handleUpdateModalOpen(user?._id))}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit" onClick={(() => handleDeleteModalOpen(user?._id))}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>



                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {isLoading == false && totalRecord != 0 &&
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          }
        </CardContent>
      </Card>



      <UpdateModal open={updateopen} setOpen={setUpdateOpen} onSubmit={handleUpdate} testimonialId={testimonialId} />

      <DetailModal open={detailModalopen} setOpen={setDetailModalOpen} testimonialId={testimonialId} />



      <DeleteModal open={deleteModal} setOpen={setDeleteModal} testimonialId={testimonialId} handleDelete={handleDelete} />






    </div>
  )
}

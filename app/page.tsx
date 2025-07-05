// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//   Building2,
//   Users,
//   Calendar,
//   CreditCard,
//   BarChart3,
//   Settings,
//   HelpCircle,
//   Home,
//   Bell,
//   Search,
//   Menu,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Building,
//   Star,
//   MessageSquare,
//   Shield,
//   FileText,
//   Clock,
//   FolderSyncIcon as Sync,
//   AlertTriangle,
//   Eye,
//   Plus,
//   Filter,
//   Download,
//   Edit,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   MapPin,
//   Phone,
//   Mail,
//   User,
//   Bot,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Progress } from "@/components/ui/progress"

// // Navigation items with all modules
// const sidebarItems = [
//   {
//     icon: Home,
//     label: "Dashboard",
//     key: "dashboard",
//     description: "Overview & Analytics",
//   },
//   {
//     icon: Building2,
//     label: "Properties",
//     key: "properties",
//     count: 24,
//     description: "Manage PG/Hostel Listings",
//   },
//   {
//     icon: Calendar,
//     label: "Bookings",
//     key: "bookings",
//     count: 12,
//     description: "Booking Management",
//   },
//   {
//     icon: Clock,
//     label: "Appointments",
//     key: "appointments",
//     count: 8,
//     description: "Visit Slot Manager",
//   },
//   {
//     icon: Users,
//     label: "Users",
//     key: "users",
//     count: 156,
//     description: "User Management",
//   },
//   {
//     icon: FileText,
//     label: "CMS",
//     key: "cms",
//     description: "Content Management",
//   },
//   {
//     icon: Bot,
//     label: "Spam Detection",
//     key: "spam",
//     count: 5,
//     description: "AI Lead Management",
//   },
//   {
//     icon: MessageSquare,
//     label: "Support Chat",
//     key: "support",
//     count: 3,
//     description: "Live Chat Panel",
//   },
//   {
//     icon: CreditCard,
//     label: "Payments",
//     key: "payments",
//     description: "Payment Gateway",
//   },
//   {
//     icon: BarChart3,
//     label: "Analytics",
//     key: "analytics",
//     description: "Reports & Insights",
//   },
//   {
//     icon: Settings,
//     label: "Settings",
//     key: "settings",
//     description: "System Configuration",
//   },
// ]

// // Sample data
// const dashboardStats = {
//   totalProperties: { value: 24, change: "+2", trend: "up" },
//   totalUsers: { value: 1567, change: "+89", trend: "up" },
//   todayBookings: { value: 12, change: "+3", trend: "up" },
//   weeklyBookings: { value: 89, change: "+15", trend: "up" },
//   lifetimeBookings: { value: 2456, change: "+234", trend: "up" },
//   vizimaBookings: { value: 1890, percentage: 77 },
//   rentokBookings: { value: 566, percentage: 23 },
//   monthlyRevenue: { value: 892000, change: "+18%", trend: "up" },
//   validLeads: { value: 234, change: "+12", trend: "up" },
//   spamLeads: { value: 45, change: "-8", trend: "down" },
//   occupancyRate: { value: 87.5, change: "-2.1%", trend: "down" },
// }

// const recentBookings = [
//   {
//     id: "BK001",
//     user: "John Doe",
//     property: "Sunrise PG",
//     room: "A-101",
//     type: "Room",
//     status: "confirmed",
//     amount: 8500,
//     date: "2024-01-15",
//     source: "Vizima",
//   },
//   {
//     id: "BK002",
//     user: "Sarah Wilson",
//     property: "Green Valley Hostel",
//     room: "Visit",
//     type: "Visit",
//     status: "pending",
//     amount: 0,
//     date: "2024-01-16",
//     source: "RentOk",
//   },
//   {
//     id: "BK003",
//     user: "Mike Johnson",
//     property: "City Center PG",
//     room: "C-301",
//     type: "Room",
//     status: "confirmed",
//     amount: 9800,
//     date: "2024-01-14",
//     source: "Vizima",
//   },
// ]

// const properties = [
//   {
//     id: "PG001",
//     name: "Sunrise PG",
//     city: "Mumbai",
//     type: "PG",
//     rooms: 25,
//     occupancy: 95,
//     revenue: 245000,
//     rating: 4.8,
//     status: "verified",
//     source: "Vizima",
//     featured: true,
//     lastSync: "2024-01-15",
//   },
//   {
//     id: "PG002",
//     name: "Green Valley Hostel",
//     city: "Pune",
//     type: "Hostel",
//     rooms: 18,
//     occupancy: 87,
//     revenue: 189000,
//     rating: 4.6,
//     status: "pending",
//     source: "RentOk",
//     featured: false,
//     lastSync: "2024-01-14",
//   },
// ]

// const users = [
//   {
//     id: "U001",
//     name: "John Doe",
//     email: "john@example.com",
//     phone: "+91 9876543210",
//     city: "Mumbai",
//     status: "verified",
//     tag: "Lead",
//     bookings: 3,
//     joinDate: "2024-01-10",
//     documents: true,
//   },
//   {
//     id: "U002",
//     name: "Sarah Wilson",
//     email: "sarah@example.com",
//     phone: "+91 9876543211",
//     city: "Pune",
//     status: "active",
//     tag: "Verified",
//     bookings: 1,
//     joinDate: "2024-01-12",
//     documents: false,
//   },
// ]

// function Sidebar({
//   className,
//   activeModule,
//   onModuleChange,
// }: {
//   className?: string
//   activeModule: string
//   onModuleChange: (module: string) => void
// }) {
//   return (
//     <div className={`pb-12 min-h-screen bg-card border-r ${className}`}>
//       <div className="space-y-4 py-4">
//         <div className="px-3 py-2">
//           <div className="flex items-center mb-6">
//             <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mr-3">
//               <Building className="h-6 w-6 text-primary-foreground" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-primary">Vizima</h2>
//               <p className="text-xs text-muted-foreground">Admin Panel</p>
//             </div>
//           </div>
//           <div className="space-y-1">
//             {sidebarItems.map((item) => (
//               <Button
//                 key={item.key}
//                 variant={activeModule === item.key ? "secondary" : "ghost"}
//                 className={`w-full justify-start h-auto p-3 ${
//                   activeModule === item.key
//                     ? "bg-primary/10 text-primary hover:bg-primary/20 border-l-2 border-primary"
//                     : "hover:bg-accent"
//                 }`}
//                 onClick={() => onModuleChange(item.key)}
//               >
//                 <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
//                 <div className="flex-1 text-left">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">{item.label}</span>
//                     {item.count && (
//                       <Badge variant="secondary" className="ml-2 text-xs">
//                         {item.count}
//                       </Badge>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
//                 </div>
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Dashboard Overview Component
// function DashboardOverview() {
//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
//             <Building2 className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary">{dashboardStats.totalProperties.value}</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <TrendingUp className="h-3 w-3 mr-1" />
//               {dashboardStats.totalProperties.change} from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{dashboardStats.totalUsers.value.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <TrendingUp className="h-3 w-3 mr-1" />
//               {dashboardStats.totalUsers.change} this week
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">
//               ₹{dashboardStats.monthlyRevenue.value.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <TrendingUp className="h-3 w-3 mr-1" />
//               {dashboardStats.monthlyRevenue.change} from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
//             <BarChart3 className="h-4 w-4 text-orange-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-600">{dashboardStats.occupancyRate.value}%</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <TrendingDown className="h-3 w-3 mr-1" />
//               {dashboardStats.occupancyRate.change} from last month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Booking Stats */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Booking Overview</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm">Today</span>
//               <span className="font-semibold">{dashboardStats.todayBookings.value}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm">This Week</span>
//               <span className="font-semibold">{dashboardStats.weeklyBookings.value}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm">Lifetime</span>
//               <span className="font-semibold">{dashboardStats.lifetimeBookings.value.toLocaleString()}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Booking Sources</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm">Vizima</span>
//                 <span className="font-semibold">{dashboardStats.vizimaBookings.value}</span>
//               </div>
//               <Progress value={dashboardStats.vizimaBookings.percentage} className="h-2" />
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm">RentOk</span>
//                 <span className="font-semibold">{dashboardStats.rentokBookings.value}</span>
//               </div>
//               <Progress value={dashboardStats.rentokBookings.percentage} className="h-2" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Lead Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-green-600">Valid Leads</span>
//               <span className="font-semibold text-green-600">{dashboardStats.validLeads.value}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-red-600">Spam Leads</span>
//               <span className="font-semibold text-red-600">{dashboardStats.spamLeads.value}</span>
//             </div>
//             <div className="pt-2 border-t">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium">Success Rate</span>
//                 <span className="font-semibold">
//                   {Math.round(
//                     (dashboardStats.validLeads.value /
//                       (dashboardStats.validLeads.value + dashboardStats.spamLeads.value)) *
//                       100,
//                   )}
//                   %
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Bookings</CardTitle>
//             <CardDescription>Latest booking requests and confirmations</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentBookings.map((booking) => (
//                 <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
//                   <div className="flex items-center space-x-3">
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback>
//                         {booking.user
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="text-sm font-medium">{booking.user}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {booking.property} - {booking.room}
//                       </p>
//                       <div className="flex items-center space-x-2 mt-1">
//                         <Badge variant="outline" className="text-xs">
//                           {booking.source}
//                         </Badge>
//                         <Badge variant="outline" className="text-xs">
//                           {booking.type}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     {booking.amount > 0 && <p className="text-sm font-medium">₹{booking.amount.toLocaleString()}</p>}
//                     <Badge
//                       variant={
//                         booking.status === "confirmed"
//                           ? "default"
//                           : booking.status === "pending"
//                             ? "secondary"
//                             : "destructive"
//                       }
//                       className="text-xs"
//                     >
//                       {booking.status}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>System Status</CardTitle>
//             <CardDescription>API health and system warnings</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm font-medium">Payment Gateway</p>
//                     <p className="text-xs text-muted-foreground">All systems operational</p>
//                   </div>
//                 </div>
//                 <Badge variant="outline" className="text-green-600 border-green-600">
//                   Online
//                 </Badge>
//               </div>

//               <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm font-medium">RentOk Sync</p>
//                     <p className="text-xs text-muted-foreground">Last sync: 2 hours ago</p>
//                   </div>
//                 </div>
//                 <Badge variant="outline" className="text-green-600 border-green-600">
//                   Active
//                 </Badge>
//               </div>

//               <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
//                 <div className="flex items-center space-x-3">
//                   <AlertTriangle className="h-5 w-5 text-yellow-600" />
//                   <div>
//                     <p className="text-sm font-medium">Database Backup</p>
//                     <p className="text-xs text-muted-foreground">Scheduled in 2 hours</p>
//                   </div>
//                 </div>
//                 <Badge variant="outline" className="text-yellow-600 border-yellow-600">
//                   Pending
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// // Properties Management Component
// function PropertiesManagement() {
//   const [selectedTab, setSelectedTab] = useState("vizima")

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">Property Management</h2>
//           <p className="text-muted-foreground">Manage your PG and Hostel listings</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Property
//           </Button>
//         </div>
//       </div>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList>
//           <TabsTrigger value="vizima">Vizima Listings</TabsTrigger>
//           <TabsTrigger value="rentok">RentOk Sync</TabsTrigger>
//         </TabsList>

//         <TabsContent value="vizima" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Vizima Properties</CardTitle>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" size="sm">
//                     <Filter className="h-4 w-4 mr-2" />
//                     Filter
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                     Refresh
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Property</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Occupancy</TableHead>
//                     <TableHead>Revenue</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {properties
//                     .filter((p) => p.source === "Vizima")
//                     .map((property) => (
//                       <TableRow key={property.id}>
//                         <TableCell>
//                           <div className="flex items-center space-x-3">
//                             <Avatar className="h-10 w-10">
//                               <AvatarImage src="/placeholder.svg?height=40&width=40" />
//                               <AvatarFallback>{property.name.substring(0, 2)}</AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="font-medium">{property.name}</p>
//                               <p className="text-sm text-muted-foreground">{property.rooms} rooms</p>
//                               {property.featured && (
//                                 <Badge variant="secondary" className="text-xs mt-1">
//                                   <Star className="h-3 w-3 mr-1" />
//                                   Featured
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center">
//                             <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
//                             {property.city}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{property.type}</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center space-x-2">
//                             <Progress value={property.occupancy} className="w-16 h-2" />
//                             <span className="text-sm">{property.occupancy}%</span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="font-medium">₹{property.revenue.toLocaleString()}</TableCell>
//                         <TableCell>
//                           <Badge variant={property.status === "verified" ? "default" : "secondary"}>
//                             {property.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button variant="ghost" size="sm">
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button variant="ghost" size="sm">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button variant="ghost" size="sm">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="rentok" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>RentOk Integration</CardTitle>
//                 <div className="flex space-x-2">
//                   <Button variant="outline">
//                     <Sync className="h-4 w-4 mr-2" />
//                     Sync All
//                   </Button>
//                   <Button>
//                     <Settings className="h-4 w-4 mr-2" />
//                     Configure
//                   </Button>
//                 </div>
//               </div>
//               <CardDescription>Manage properties synced from RentOk platform</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//                     <div>
//                       <p className="font-medium">Sync Status</p>
//                       <p className="text-sm text-muted-foreground">Last synced: 2 hours ago</p>
//                     </div>
//                   </div>
//                   <Button variant="outline" size="sm">
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                     Sync Now
//                   </Button>
//                 </div>

//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Property</TableHead>
//                       <TableHead>Last Sync</TableHead>
//                       <TableHead>Override Fields</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {properties
//                       .filter((p) => p.source === "RentOk")
//                       .map((property) => (
//                         <TableRow key={property.id}>
//                           <TableCell>
//                             <div className="flex items-center space-x-3">
//                               <Avatar className="h-10 w-10">
//                                 <AvatarFallback>{property.name.substring(0, 2)}</AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium">{property.name}</p>
//                                 <p className="text-sm text-muted-foreground">{property.city}</p>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>{property.lastSync}</TableCell>
//                           <TableCell>
//                             <div className="flex space-x-1">
//                               <Badge variant="outline" className="text-xs">
//                                 Pricing
//                               </Badge>
//                               <Badge variant="outline" className="text-xs">
//                                 Images
//                               </Badge>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant="default">Synced</Badge>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               <Button variant="ghost" size="sm">
//                                 <Sync className="h-4 w-4" />
//                               </Button>
//                               <Button variant="ghost" size="sm">
//                                 <Settings className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// // User Management Component
// function UserManagement() {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">User Management</h2>
//           <p className="text-muted-foreground">Manage registered users and their data</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export Users
//           </Button>
//           <Button variant="outline">
//             <Filter className="h-4 w-4 mr-2" />
//             Filter
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-6">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>User</TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Tag</TableHead>
//                 <TableHead>Bookings</TableHead>
//                 <TableHead>Documents</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell>
//                     <div className="flex items-center space-x-3">
//                       <Avatar className="h-10 w-10">
//                         <AvatarFallback>
//                           {user.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium">{user.name}</p>
//                         <p className="text-sm text-muted-foreground">ID: {user.id}</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="space-y-1">
//                       <div className="flex items-center text-sm">
//                         <Mail className="h-3 w-3 mr-1" />
//                         {user.email}
//                       </div>
//                       <div className="flex items-center text-sm">
//                         <Phone className="h-3 w-3 mr-1" />
//                         {user.phone}
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center">
//                       <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
//                       {user.city}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={user.status === "verified" ? "default" : "secondary"}>{user.status}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{user.tag}</Badge>
//                   </TableCell>
//                   <TableCell className="font-medium">{user.bookings}</TableCell>
//                   <TableCell>
//                     {user.documents ? (
//                       <Badge variant="default" className="text-xs">
//                         <CheckCircle className="h-3 w-3 mr-1" />
//                         Uploaded
//                       </Badge>
//                     ) : (
//                       <Badge variant="secondary" className="text-xs">
//                         <XCircle className="h-3 w-3 mr-1" />
//                         Pending
//                       </Badge>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button variant="ghost" size="sm">
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Shield className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// // Main Dashboard Component
// function VizimaDashboard() {
//   const [activeModule, setActiveModule] = useState("dashboard")
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const renderContent = () => {
//     switch (activeModule) {
//       case "dashboard":
//         return <DashboardOverview />
//       case "properties":
//         return <PropertiesManagement />
//       case "users":
//         return <UserManagement />
//       case "bookings":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Booking Management</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">Booking management interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "appointments":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Appointment Slot Manager</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">Appointment slot management interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "cms":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Content Management System</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">CMS interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "spam":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Spam Detection & Lead Management</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">AI spam detection interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "support":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Support Chat Panel</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">Live chat support interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "payments":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Payment Management</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">Payment gateway interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "analytics":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Analytics & Reports</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       case "settings":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">System Settings</h2>
//             <Card>
//               <CardContent className="p-6">
//                 <p className="text-muted-foreground">Settings interface coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>
//         )
//       default:
//         return <DashboardOverview />
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="flex">
//         {/* Desktop Sidebar */}
//         <div className="hidden lg:block w-80">
//           <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
//         </div>

//         {/* Mobile Sidebar */}
//         <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
//           <SheetContent side="left" className="p-0 w-80">
//             <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
//           </SheetContent>
//         </Sheet>

//         {/* Main Content */}
//         <div className="flex-1">
//           {/* Header */}
//           <header className="bg-card border-b px-6 py-4 sticky top-0 z-40">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <Sheet>
//                   <SheetTrigger asChild>
//                     <Button variant="ghost" size="icon" className="lg:hidden">
//                       <Menu className="h-6 w-6" />
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent side="left" className="p-0 w-80">
//                     <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
//                   </SheetContent>
//                 </Sheet>
//                 <div>
//                   <h1 className="text-2xl font-bold capitalize">
//                     {sidebarItems.find((item) => item.key === activeModule)?.label || "Dashboard"}
//                   </h1>
//                   <p className="text-muted-foreground">
//                     {sidebarItems.find((item) => item.key === activeModule)?.description || "Welcome back, Admin!"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="relative hidden md:block">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                   <Input placeholder="Search..." className="pl-10 w-64" />
//                 </div>

//                 <Button variant="ghost" size="icon" className="relative">
//                   <Bell className="h-5 w-5" />
//                   <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
//                     3
//                   </Badge>
//                 </Button>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
//                         <AvatarFallback>AD</AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56" align="end" forceMount>
//                     <DropdownMenuLabel className="font-normal">
//                       <div className="flex flex-col space-y-1">
//                         <p className="text-sm font-medium leading-none">Admin User</p>
//                         <p className="text-xs leading-none text-muted-foreground">admin@vizima.com</p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                       <User className="mr-2 h-4 w-4" />
//                       Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Settings className="mr-2 h-4 w-4" />
//                       Settings
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <HelpCircle className="mr-2 h-4 w-4" />
//                       Support
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>Log out</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </header>

//           {/* Main Content Area */}
//           <main className="p-6">{renderContent()}</main>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function HomePage() {
//   const router = useRouter()

//   useEffect(() => {
//     router.push("/dashboard")
//   }, [router])

//   return null
// }

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// const LoginPage = () => {

//   return (

//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <Card className="w-full max-w-md shadow-lg border border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">Login</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-1">
//             <Label htmlFor="name">Name</Label>
//             <Input id="name" placeholder="Enter your name" />
//           </div>

//           <div className="space-y-1">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" placeholder="Enter your email" />
//           </div>

//           <div className="space-y-1">
//             <Label htmlFor="password">Password</Label>
//             <Input id="password" type="password" placeholder="Enter your password" />
//           </div>

//           <div className="space-y-1">
//             <Label htmlFor="phone">Phone</Label>
//             <Input id="phone" type="tel" placeholder="Enter your phone number" />
//           </div>

//           <div className="space-y-1">
//             <Label htmlFor="role">Role</Label>
//             <Input id="role" placeholder="Enter your role" />
//           </div>

//           <Button className="w-full mt-4">Login</Button>
//         </CardContent>
//       </Card>
//     </div>
//   )


// }

// export default LoginPage



"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthServices } from "@/src/services/AuthServices";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


// Define Zod validation schema
const LoginSchema = z.object({
  // name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  // phone: z
  //   .string()
  //   .min(10, "Phone number must be at least 10 digits")
  //   .max(15, "Phone number is too long"),
  // role: z.string().min(1, "Role is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

interface LoginFormProps {
  schema: z.ZodType<any, any>;
  defaultValues: LoginFormValues;
  onSubmit: (data: LoginFormValues) => void;
  isPending?: boolean;
  buttonText?: string;
  linkText?: string;
  linkLabel?: string;
  role?: string;
}

const LoginPage = () => {



  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    reset,
    setError,
    setValue, // ✅ Add this line

  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-primary mr-2" />
        <span className="text-lg">Redirecting...</span>
      </div>
    );
  }


  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await AuthServices.login(data);
      const token = response?.token;
      const user = response?.data?.user;
      if (user && token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("admin-info", JSON.stringify(user));
        toast.success("Logged in successfully");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        const errorMessage = response?.data?.message || "Invalid email or password";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
    }
  });






  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="lg:w-1/3 border p-8 rounded-lg shadow-lg mx-4 lg:mx-auto">

        <form onSubmit={onSubmit} className="py-2">
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">
                Log in to Vizima account
              </h2>
            </div>

            {/* <FormField label="Name" error={errors.name?.message}>
              <Input
                type="string"
                placeholder="Enter Name"
                {...register("name")}
              />
            </FormField> */}

            {/* Email Field */}
            <FormField label="Email address" error={errors.email?.message}>
              <Input
                type="email"
                placeholder="Enter email"
                {...register("email")}
              />
            </FormField>

            {/* <FormField label="Phone" error={errors.phone?.message}>
              <Input
                type="string"
                placeholder="Enter Mobile Number"
                {...register("phone")}
              />
            </FormField> */}

            {/* <FormField label="Role" error={errors.role?.message}>
              <Select onValueChange={(value) => setValue("role", value)} defaultValue="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </FormField> */}

            {/* Password Field */}
            <FormField label="Password" error={errors.password?.message}>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                  autoComplete="off"
                />
                <TogglePasswordButton
                  show={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                />
              </div>
            </FormField>

            {/* Forgot Password */}
            <div className="text-sm text-gray-600">
              <button
                type="button"
                // onClick={() => router.push(`/${loginProps.role}/reset-password`)}
                className="secondary-btn"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-semibold mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>

          {/* Sign Up Link */}
          <div className="text-sm text-gray-600 mt-5">
            Don&apos;t have an account?{" "}
            <Link href={``} className="secondary-btn">
              {"Sign Up"}
            </Link>
          </div>
        </form>

        <Toaster duration={5000}
          position="top-right"
          richColors
          closeButton
          visibleToasts={5}
          expand />
      </div>
    </div>
  )
}

export default LoginPage



/** 🔹 Reusable FormField Component */
function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/** 🔹 Toggle Password Button Component */
function TogglePasswordButton({
  show,
  toggle,
}: {
  show: boolean;
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  )
}





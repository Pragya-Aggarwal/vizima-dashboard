// "use client"

// import { useState } from "react"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { Download, Calendar, ArrowUpRight, ArrowDownRight, Users, Building2, CreditCard } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Sample data for charts
// const monthlyData = [
//   { name: "Jan", bookings: 65, revenue: 45000, occupancy: 72 },
//   { name: "Feb", bookings: 59, revenue: 40000, occupancy: 68 },
//   { name: "Mar", bookings: 80, revenue: 56000, occupancy: 78 },
//   { name: "Apr", bookings: 81, revenue: 58000, occupancy: 80 },
//   { name: "May", bookings: 56, revenue: 39000, occupancy: 65 },
//   { name: "Jun", bookings: 55, revenue: 37000, occupancy: 62 },
//   { name: "Jul", bookings: 40, revenue: 28000, occupancy: 55 },
//   { name: "Aug", bookings: 45, revenue: 30000, occupancy: 58 },
//   { name: "Sep", bookings: 60, revenue: 42000, occupancy: 70 },
//   { name: "Oct", bookings: 75, revenue: 52000, occupancy: 76 },
//   { name: "Nov", bookings: 85, revenue: 60000, occupancy: 82 },
//   { name: "Dec", bookings: 90, revenue: 65000, occupancy: 85 },
// ]

// const cityData = [
//   { name: "Mumbai", value: 45 },
//   { name: "Delhi", value: 28 },
//   { name: "Bangalore", value: 18 },
//   { name: "Pune", value: 9 },
// ]

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// const propertyTypeData = [
//   { name: "Single Room", bookings: 120, revenue: 840000 },
//   { name: "Double Room", bookings: 86, revenue: 688000 },
//   { name: "Triple Room", bookings: 54, revenue: 486000 },
//   { name: "Deluxe Room", bookings: 42, revenue: 462000 },
// ]

// const userAcquisitionData = [
//   { name: "Direct", value: 45 },
//   { name: "Organic Search", value: 25 },
//   { name: "Referral", value: 15 },
//   { name: "Social Media", value: 15 },
// ]

// export default function AnalyticsPage() {
//   const [timeRange, setTimeRange] = useState("year")
//   const [selectedTab, setSelectedTab] = useState("overview")

//   // Stats for the current period
//   const stats = {
//     totalBookings: 712,
//     bookingChange: "+12.5%",
//     totalRevenue: "₹5,52,000",
//     revenueChange: "+8.2%",
//     averageOccupancy: "74%",
//     occupancyChange: "+3.5%",
//     totalUsers: 1567,
//     userChange: "+15.3%",
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
//           <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button variant="outline">
//             <Calendar className="h-4 w-4 mr-2" />
//             Date Range
//           </Button>
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export Report
//           </Button>
//         </div>
//       </div>

//       {/* Time Range Selector */}
//       <div className="flex justify-end">
//         <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select time range" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="week">Last 7 days</SelectItem>
//             <SelectItem value="month">Last 30 days</SelectItem>
//             <SelectItem value="quarter">Last 90 days</SelectItem>
//             <SelectItem value="year">Last 12 months</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="card-hover">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalBookings}</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <span
//                 className={`flex items-center ${stats.bookingChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
//               >
//                 {stats.bookingChange.startsWith("+") ? (
//                   <ArrowUpRight className="h-3 w-3 mr-1" />
//                 ) : (
//                   <ArrowDownRight className="h-3 w-3 mr-1" />
//                 )}
//                 {stats.bookingChange}
//               </span>
//               <span className="ml-1">from previous period</span>
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="card-hover">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <CreditCard className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalRevenue}</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <span
//                 className={`flex items-center ${stats.revenueChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
//               >
//                 {stats.revenueChange.startsWith("+") ? (
//                   <ArrowUpRight className="h-3 w-3 mr-1" />
//                 ) : (
//                   <ArrowDownRight className="h-3 w-3 mr-1" />
//                 )}
//                 {stats.revenueChange}
//               </span>
//               <span className="ml-1">from previous period</span>
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="card-hover">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
//             <Building2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.averageOccupancy}</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <span
//                 className={`flex items-center ${stats.occupancyChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
//               >
//                 {stats.occupancyChange.startsWith("+") ? (
//                   <ArrowUpRight className="h-3 w-3 mr-1" />
//                 ) : (
//                   <ArrowDownRight className="h-3 w-3 mr-1" />
//                 )}
//                 {stats.occupancyChange}
//               </span>
//               <span className="ml-1">from previous period</span>
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="card-hover">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalUsers}</div>
//             <p className="text-xs text-muted-foreground flex items-center">
//               <span
//                 className={`flex items-center ${stats.userChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
//               >
//                 {stats.userChange.startsWith("+") ? (
//                   <ArrowUpRight className="h-3 w-3 mr-1" />
//                 ) : (
//                   <ArrowDownRight className="h-3 w-3 mr-1" />
//                 )}
//                 {stats.userChange}
//               </span>
//               <span className="ml-1">from previous period</span>
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="bookings">Bookings</TabsTrigger>
//           <TabsTrigger value="revenue">Revenue</TabsTrigger>
//           <TabsTrigger value="users">Users</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           {/* Monthly Performance Chart */}
//           <Card className="card-hover">
//             <CardHeader>
//               <CardTitle>Monthly Performance</CardTitle>
//               <CardDescription>Bookings, revenue, and occupancy trends over time</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[400px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={monthlyData}
//                   margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     yAxisId="left"
//                     type="monotone"
//                     dataKey="bookings"
//                     stroke="#0088FE"
//                     activeDot={{ r: 8 }}
//                     name="Bookings"
//                   />
//                   <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#00C49F" name="Occupancy %" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Distribution Charts */}
//           <div className="grid gap-4 md:grid-cols-2">
//             <Card className="card-hover">
//               <CardHeader>
//                 <CardTitle>Bookings by City</CardTitle>
//                 <CardDescription>Distribution of bookings across cities</CardDescription>
//               </CardHeader>
//               <CardContent className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={cityData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {cityData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card className="card-hover">
//               <CardHeader>
//                 <CardTitle>User Acquisition</CardTitle>
//                 <CardDescription>How users are finding your platform</CardDescription>
//               </CardHeader>
//               <CardContent className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={userAcquisitionData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {userAcquisitionData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Property Type Performance */}
//           <Card className="card-hover">
//             <CardHeader>
//               <CardTitle>Property Type Performance</CardTitle>
//               <CardDescription>Bookings and revenue by property type</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[400px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={propertyTypeData}
//                   margin={{
//                     top: 20,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="bookings" fill="#0088FE" name="Bookings" />
//                   <Bar dataKey="revenue" fill="#00C49F" name="Revenue (₹)" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="bookings" className="space-y-4">
//           <Card className="card-hover">
//             <CardHeader>
//               <CardTitle>Booking Trends</CardTitle>
//               <CardDescription>Monthly booking patterns</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[400px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={monthlyData}
//                   margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="bookings" stroke="#0088FE" activeDot={{ r: 8 }} name="Bookings" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="revenue" className="space-y-4">
//           <Card className="card-hover">
//             <CardHeader>
//               <CardTitle>Revenue Analysis</CardTitle>
//               <CardDescription>Monthly revenue breakdown</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[400px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={monthlyData}
//                   margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="revenue" fill="#00C49F" name="Revenue (₹)" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="users" className="space-y-4">
//           <Card className="card-hover">
//             <CardHeader>
//               <CardTitle>User Acquisition Channels</CardTitle>
//               <CardDescription>How users are finding your platform</CardDescription>
//             </CardHeader>
//             <CardContent className="h-[400px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={userAcquisitionData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={120}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {userAcquisitionData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

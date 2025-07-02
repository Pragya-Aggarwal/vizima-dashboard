// "use client"

// import { useState } from "react"
// import {
//   Download,
//   Filter,
//   RefreshCw,
//   Eye,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// const transactions = [
//   {
//     id: "TXN001",
//     bookingId: "BK001",
//     user: "John Doe",
//     amount: 8500,
//     status: "completed",
//     method: "Credit Card",
//     gateway: "Razorpay",
//     date: "2024-01-16 10:30 AM",
//     fees: 255,
//     netAmount: 8245,
//   },
//   {
//     id: "TXN002",
//     bookingId: "BK002",
//     user: "Sarah Wilson",
//     amount: 6200,
//     status: "pending",
//     method: "UPI",
//     gateway: "Razorpay",
//     date: "2024-01-16 02:15 PM",
//     fees: 186,
//     netAmount: 6014,
//   },
//   {
//     id: "TXN003",
//     bookingId: "BK003",
//     user: "Mike Johnson",
//     amount: 9800,
//     status: "failed",
//     method: "Net Banking",
//     gateway: "PayU",
//     date: "2024-01-15 08:45 PM",
//     fees: 0,
//     netAmount: 0,
//   },
//   {
//     id: "TXN004",
//     bookingId: "BK004",
//     user: "Emma Davis",
//     amount: 8500,
//     status: "refunded",
//     method: "Credit Card",
//     gateway: "Stripe",
//     date: "2024-01-15 11:20 AM",
//     fees: -255,
//     netAmount: 8245,
//   },
// ]

// const gatewayStats = [
//   { name: "Razorpay", transactions: 156, amount: 1245000, success: 94.5, fees: 2.5 },
//   { name: "PayU", transactions: 89, amount: 678000, success: 91.2, fees: 2.8 },
//   { name: "Stripe", transactions: 67, amount: 523000, success: 96.1, fees: 2.9 },
// ]

// export default function PaymentsPage() {
//   const [selectedTab, setSelectedTab] = useState("transactions")
//   const [statusFilter, setStatusFilter] = useState("all")

//   const stats = {
//     totalRevenue: 2446000,
//     todayRevenue: 45600,
//     totalTransactions: 312,
//     successRate: 93.8,
//     totalFees: 73380,
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">Payment Management</h2>
//           <p className="text-muted-foreground">Monitor transactions and payment gateway performance</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//           <Button variant="outline">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-5">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
//             <p className="text-xs text-muted-foreground">Total Revenue</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-green-600">₹{stats.todayRevenue.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">Today's Revenue</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</div>
//             <p className="text-xs text-muted-foreground">Total Transactions</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-purple-600">{stats.successRate}%</div>
//             <p className="text-xs text-muted-foreground">Success Rate</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-orange-600">₹{stats.totalFees.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">Total Fees</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList>
//           <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
//           <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         {/* Transactions Tab */}
//         <TabsContent value="transactions" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Transaction History</CardTitle>
//                 <div className="flex space-x-2">
//                   <Input placeholder="Search transactions..." className="w-64" />
//                   <Select value={statusFilter} onValueChange={setStatusFilter}>
//                     <SelectTrigger className="w-32">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="completed">Completed</SelectItem>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="failed">Failed</SelectItem>
//                       <SelectItem value="refunded">Refunded</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Button variant="outline" size="sm">
//                     <Filter className="h-4 w-4 mr-2" />
//                     Filter
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Transaction ID</TableHead>
//                     <TableHead>User</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Method</TableHead>
//                     <TableHead>Gateway</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {transactions.map((transaction) => (
//                     <TableRow key={transaction.id}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{transaction.id}</p>
//                           <p className="text-sm text-muted-foreground">{transaction.bookingId}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell>{transaction.user}</TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">₹{transaction.amount.toLocaleString()}</p>
//                           {transaction.status === "completed" && (
//                             <p className="text-xs text-muted-foreground">
//                               Net: ₹{transaction.netAmount.toLocaleString()}
//                             </p>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{transaction.method}</Badge>
//                       </TableCell>
//                       <TableCell>{transaction.gateway}</TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             transaction.status === "completed"
//                               ? "default"
//                               : transaction.status === "pending"
//                                 ? "secondary"
//                                 : transaction.status === "failed"
//                                   ? "destructive"
//                                   : "outline"
//                           }
//                         >
//                           {transaction.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
//                           {transaction.status === "pending" && <AlertTriangle className="h-3 w-3 mr-1" />}
//                           {transaction.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
//                           {transaction.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>{transaction.date}</TableCell>
//                       <TableCell>
//                         <div className="flex space-x-1">
//                           <Button variant="ghost" size="sm">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           {transaction.status === "completed" && (
//                             <Button variant="ghost" size="sm">
//                               <Download className="h-4 w-4" />
//                             </Button>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Payment Gateways Tab */}
//         <TabsContent value="gateways" className="space-y-4">
//           <div className="grid gap-6 md:grid-cols-3">
//             {gatewayStats.map((gateway) => (
//               <Card key={gateway.name}>
//                 <CardHeader>
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-lg">{gateway.name}</CardTitle>
//                     <Badge variant="default">Active</Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Transactions:</span>
//                     <span className="font-medium">{gateway.transactions}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Amount:</span>
//                     <span className="font-medium">₹{gateway.amount.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Success Rate:</span>
//                     <span className="font-medium">{gateway.success}%</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Fees:</span>
//                     <span className="font-medium">{gateway.fees}%</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         {/* Analytics Tab */}
//         <TabsContent value="analytics" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Analytics Coming Soon</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">Detailed analytics will be available in future updates.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Settings Tab */}
//         <TabsContent value="settings" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Settings</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">Configure payment settings and preferences here.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

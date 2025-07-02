"use client"

import { useState } from "react"
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Send,
  Paperclip,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Search,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const supportTickets = [
  {
    id: "TKT001",
    user: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
    },
    subject: "Room booking issue",
    message: "I'm having trouble booking a room in Sunrise PG. The payment is not going through.",
    status: "open",
    priority: "high",
    category: "booking",
    assignedTo: "Support Agent 1",
    createdAt: "2024-01-16 10:30 AM",
    lastReply: "2024-01-16 11:15 AM",
    source: "WhatsApp",
  },
  {
    id: "TKT002",
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+91 9876543211",
    },
    subject: "Property information request",
    message: "Can you provide more details about amenities in Green Valley Hostel?",
    status: "pending",
    priority: "medium",
    category: "inquiry",
    assignedTo: "Support Agent 2",
    createdAt: "2024-01-16 02:15 PM",
    lastReply: "2024-01-16 02:15 PM",
    source: "Tawk.to",
  },
  {
    id: "TKT003",
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+91 9876543212",
    },
    subject: "Refund request",
    message: "I need to cancel my booking and request a refund due to emergency.",
    status: "resolved",
    priority: "high",
    category: "refund",
    assignedTo: "Support Agent 1",
    createdAt: "2024-01-15 08:45 PM",
    lastReply: "2024-01-16 09:30 AM",
    source: "Email",
  },
]

const chatMessages = [
  {
    id: 1,
    sender: "user",
    message: "Hi, I'm having trouble booking a room in Sunrise PG. The payment is not going through.",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "agent",
    message:
      "Hello John! I'm sorry to hear about the payment issue. Let me help you with that. Can you please tell me which payment method you're trying to use?",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: "user",
    message: "I'm trying to use my credit card ending in 1234. It shows an error message.",
    timestamp: "10:35 AM",
  },
  {
    id: 4,
    sender: "agent",
    message:
      "I see the issue. There seems to be a temporary problem with our payment gateway. Let me process this manually for you. Can you please confirm the room details?",
    timestamp: "10:38 AM",
  },
  {
    id: 5,
    sender: "user",
    message: "Yes, it's Room A-101 in Sunrise PG for 1 month starting February 1st.",
    timestamp: "10:40 AM",
  },
]

function ChatInterface({ ticket }: { ticket: (typeof supportTickets)[0] }) {
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h3 className="font-semibold">{ticket.subject}</h3>
          <p className="text-sm text-muted-foreground">
            {ticket.user.name} • {ticket.source}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={ticket.status === "open" ? "destructive" : ticket.status === "pending" ? "secondary" : "default"}
          >
            {ticket.status}
          </Badge>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "agent" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Pending
            </Button>
          </div>
          <Select defaultValue="normal">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default function SupportChatPage() {
  const [selectedTicket, setSelectedTicket] = useState(supportTickets[0])
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTickets = supportTickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false
    return true
  })

  const stats = {
    total: supportTickets.length,
    open: supportTickets.filter((t) => t.status === "open").length,
    pending: supportTickets.filter((t) => t.status === "pending").length,
    resolved: supportTickets.filter((t) => t.status === "resolved").length,
    avgResponseTime: "12 min",
  }

  return (
    <div className="space-y-6 mt-5 mx-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Support Chat Panel</h2>
          <p className="text-muted-foreground">Manage live chat support and customer tickets</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Call Center
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Support
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Open</p>
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
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Avg Response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Support Tickets</CardTitle>
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search tickets..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTicket.id === ticket.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {ticket.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{ticket.user.name}</span>
                      </div>
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "destructive"
                            : ticket.status === "pending"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{ticket.subject}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{ticket.message}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {ticket.source}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            ticket.priority === "high"
                              ? "border-red-500 text-red-500"
                              : ticket.priority === "medium"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-green-500 text-green-500"
                          }`}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{ticket.lastReply}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <ChatInterface ticket={selectedTicket} />
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions & Templates</CardTitle>
          <CardDescription>Common responses and escalation options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <MessageSquare className="h-5 w-5 mb-2" />
              <span className="font-medium">Booking Help</span>
              <span className="text-xs text-muted-foreground">Standard booking assistance</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Star className="h-5 w-5 mb-2" />
              <span className="font-medium">Property Info</span>
              <span className="text-xs text-muted-foreground">Property details template</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <AlertCircle className="h-5 w-5 mb-2" />
              <span className="font-medium">Escalate</span>
              <span className="text-xs text-muted-foreground">Escalate to manager</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <CheckCircle className="h-5 w-5 mb-2" />
              <span className="font-medium">Close Ticket</span>
              <span className="text-xs text-muted-foreground">Mark as resolved</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

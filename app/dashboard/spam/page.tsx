"use client"

import { useState } from "react"
import {
  Bot,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  MapPin,
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
import { Progress } from "@/components/ui/progress"

const spamLeads = [
  {
    id: "SPM001",
    name: "Fake User 1",
    email: "fake1@tempmail.com",
    phone: "+91 9999999999",
    city: "Mumbai",
    confidence: 95,
    reasons: ["Temporary email", "Invalid phone pattern", "Suspicious behavior"],
    detectedAt: "2024-01-16 10:30 AM",
    status: "flagged",
    source: "Contact Form",
  },
  {
    id: "SPM002",
    name: "Test Account",
    email: "test@test.com",
    phone: "+91 1234567890",
    city: "Delhi",
    confidence: 88,
    reasons: ["Test email domain", "Sequential phone number"],
    detectedAt: "2024-01-16 02:15 PM",
    status: "flagged",
    source: "Registration",
  },
  {
    id: "SPM003",
    name: "Bot User",
    email: "bot@example.com",
    phone: "+91 0000000000",
    city: "Pune",
    confidence: 92,
    reasons: ["Bot-like behavior", "Invalid phone", "Rapid submissions"],
    detectedAt: "2024-01-15 08:45 PM",
    status: "confirmed_spam",
    source: "Property Inquiry",
  },
]

const validLeads = [
  {
    id: "VLD001",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+91 9876543210",
    city: "Mumbai",
    confidence: 15,
    reasons: ["Valid email domain", "Proper phone format"],
    detectedAt: "2024-01-16 11:00 AM",
    status: "valid",
    source: "Contact Form",
  },
  {
    id: "VLD002",
    name: "Sarah Wilson",
    email: "sarah.w@outlook.com",
    phone: "+91 9876543211",
    city: "Bangalore",
    confidence: 8,
    reasons: ["Legitimate email", "Normal behavior pattern"],
    detectedAt: "2024-01-16 01:30 PM",
    status: "valid",
    source: "Registration",
  },
]

const aiSettings = {
  emailDomainCheck: true,
  phoneValidation: true,
  behaviorAnalysis: true,
  temporaryEmailBlock: true,
  rapidSubmissionDetection: true,
  suspiciousPatternDetection: true,
  confidenceThreshold: 80,
  autoDeleteAfterDays: 30,
}

function LeadDetailsDialog({ lead, type }: { lead: any; type: "spam" | "valid" }) {
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
          <DialogTitle>Lead Details - {lead.id}</DialogTitle>
          <DialogDescription>AI spam detection analysis and lead information</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {lead.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <Badge variant={type === "spam" ? "destructive" : "default"}>{lead.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.detectedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Spam Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={lead.confidence} className="w-16 h-2" />
                    <span className="font-medium">{lead.confidence}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Source:</span>
                  <Badge variant="outline">{lead.source}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lead ID:</span>
                  <span className="font-mono text-sm">{lead.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detection Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lead.reasons.map((reason: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    {type === "spam" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm">{reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="space-x-2">
              {type === "spam" ? (
                <Button variant="default">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Valid
                </Button>
              ) : (
                <Button variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as Spam
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lead
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SpamDetectionPage() {
  const [selectedTab, setSelectedTab] = useState("spam")
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState('')

  const stats = {
    totalSpam: spamLeads.length,
    totalValid: validLeads.length,
    todayDetected: 8,
    accuracy: 94.5,
    autoDeleted: 15,
  }

  const filteredSpamLeads = spamLeads.filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase()) ||
    lead.email?.toLowerCase().includes(search.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredValidLeads = validLeads.filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase()) ||
    lead.email?.toLowerCase().includes(search.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 mt-5 mx-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Spam Detection & Lead Management</h2>
          <p className="text-muted-foreground">AI-powered spam detection and lead quality management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Leads
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
            <div className="text-2xl font-bold text-red-600">{stats.totalSpam}</div>
            <p className="text-xs text-muted-foreground">Spam Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.totalValid}</div>
            <p className="text-xs text-muted-foreground">Valid Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.todayDetected}</div>
            <p className="text-xs text-muted-foreground">Today Detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">AI Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.autoDeleted}</div>
            <p className="text-xs text-muted-foreground">Auto Deleted</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="spam">Spam Leads ({filteredSpamLeads.length})</TabsTrigger>
          <TabsTrigger value="valid">Valid Leads ({filteredValidLeads.length})</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="spam" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Flagged Spam Leads
                </CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search leads..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="confirmed_spam">Confirmed</SelectItem>
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
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpamLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {lead.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {lead.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={lead.confidence} className="w-16 h-2" />
                          <span className="text-sm font-medium text-red-600">{lead.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{lead.detectedAt}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.status === "confirmed_spam" ? "destructive" : "secondary"}>
                          {lead.status === "confirmed_spam" ? (
                            <XCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {lead.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <LeadDetailsDialog lead={lead} type="spam" />
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valid" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Valid Leads
                </CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search leads..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredValidLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {lead.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {lead.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={lead.confidence} className="w-16 h-2" />
                          <span className="text-sm font-medium text-green-600">{lead.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{lead.detectedAt}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <LeadDetailsDialog lead={lead} type="valid" />
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Detection Settings</CardTitle>
                <CardDescription>Configure spam detection algorithms and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Domain Check</p>
                      <p className="text-sm text-muted-foreground">Validate email domains</p>
                    </div>
                    <Badge variant={aiSettings.emailDomainCheck ? "default" : "secondary"}>
                      {aiSettings.emailDomainCheck ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Phone Validation</p>
                      <p className="text-sm text-muted-foreground">Check phone number patterns</p>
                    </div>
                    <Badge variant={aiSettings.phoneValidation ? "default" : "secondary"}>
                      {aiSettings.phoneValidation ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Behavior Analysis</p>
                      <p className="text-sm text-muted-foreground">Analyze user behavior patterns</p>
                    </div>
                    <Badge variant={aiSettings.behaviorAnalysis ? "default" : "secondary"}>
                      {aiSettings.behaviorAnalysis ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Temporary Email Block</p>
                      <p className="text-sm text-muted-foreground">Block temporary email services</p>
                    </div>
                    <Badge variant={aiSettings.temporaryEmailBlock ? "default" : "secondary"}>
                      {aiSettings.temporaryEmailBlock ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threshold Settings</CardTitle>
                <CardDescription>Configure detection sensitivity and auto-actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Confidence Threshold</p>
                      <span className="text-sm font-medium">{aiSettings.confidenceThreshold}%</span>
                    </div>
                    <Progress value={aiSettings.confidenceThreshold} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">Leads above this threshold are flagged as spam</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Auto-delete After</p>
                      <span className="text-sm font-medium">{aiSettings.autoDeleteAfterDays} days</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confirmed spam leads are automatically deleted</p>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Update Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

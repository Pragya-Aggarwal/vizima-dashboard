"use client"

import { useState, useEffect } from "react"
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
import { getSpamReports } from "@/src/services/SpamService"
import { Dialog as ShadDialog, DialogTrigger as ShadDialogTrigger, DialogContent as ShadDialogContent, DialogHeader as ShadDialogHeader, DialogTitle as ShadDialogTitle, DialogDescription as ShadDialogDescription } from "@/components/ui/dialog"

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
          <DialogTitle>Lead Details - {lead._id}</DialogTitle>
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
                  <span className="font-mono text-sm">{lead._id}</span>
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
  const [spamReports, setSpamReports] = useState<any[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    contentType: '',
    reportType: '',
    sortBy: 'reportedAt',
    sortOrder: 'desc',
    limit: 20,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {
          page,
          limit: filters.limit,
          ...(filters.status && filters.status !== 'all' && { status: filters.status }),
          ...(filters.severity && filters.severity !== 'all' && { severity: filters.severity }),
          ...(filters.contentType && filters.contentType !== 'all' && { contentType: filters.contentType }),
          ...(filters.reportType && filters.reportType !== 'all' && { reportType: filters.reportType }),
          ...(filters.sortBy && { sortBy: filters.sortBy }),
          ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
          ...(search && { search }),
        }
        const res = await getSpamReports(params)
        setSpamReports(res.data.docs)
        setTotalDocs(res.data.totalDocs)
        setPage(res.data.page)
        setTotalPages(res.data.totalPages)
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch spam reports')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filters, search, page])

  const stats = {
    totalSpam: totalDocs,
    totalValid: 0, // Not available in new API
    todayDetected: 0,
    accuracy: 0,
    autoDeleted: 0,
  }

  const filteredSpamReports = spamReports.filter((report) =>
    report.userReportDetails?.reason?.toLowerCase().includes(search.toLowerCase()) ||
    report.detectionResult?.reasons?.join(' ').toLowerCase().includes(search.toLowerCase()) ||
    report.reportType?.toLowerCase().includes(search.toLowerCase()) ||
    report.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApplyFilters = () => {
    setFilterDialogOpen(false)
    setPage(1)
  }
  const handleResetFilters = () => {
    setFilters({
      status: '',
      severity: '',
      contentType: '',
      reportType: '',
      sortBy: 'reportedAt',
      sortOrder: 'desc',
      limit: 20,
    })
    setFilterDialogOpen(false)
    setPage(1)
  }

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
          <TabsTrigger value="spam">Spam Leads ({filteredSpamReports.length})</TabsTrigger>
          <TabsTrigger value="valid">Valid Leads ({0})</TabsTrigger>
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                  <ShadDialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                    <ShadDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </ShadDialogTrigger>
                    <ShadDialogContent className="max-w-md">
                      <ShadDialogHeader>
                        <ShadDialogTitle>Filter Spam Reports</ShadDialogTitle>
                        <ShadDialogDescription>Apply filters to narrow down spam reports.</ShadDialogDescription>
                      </ShadDialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <Select value={filters.status || "all"} onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
                            <SelectTrigger><SelectValue placeholder="Any status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="dismissed">Dismissed</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="false_positive">False Positive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Severity</label>
                          <Select value={filters.severity || "all"} onValueChange={v => setFilters(f => ({ ...f, severity: v }))}>
                            <SelectTrigger><SelectValue placeholder="Any severity" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Content Type</label>
                          <Select value={filters.contentType || "all"} onValueChange={v => setFilters(f => ({ ...f, contentType: v }))}>
                            <SelectTrigger><SelectValue placeholder="Any content type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="property">Property</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="booking">Booking</SelectItem>
                              <SelectItem value="message">Message</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Report Type</label>
                          <Select value={filters.reportType || "all"} onValueChange={v => setFilters(f => ({ ...f, reportType: v }))}>
                            <SelectTrigger><SelectValue placeholder="Any report type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="automated">Automated</SelectItem>
                              <SelectItem value="user_reported">User Reported</SelectItem>
                              <SelectItem value="system_flagged">System Flagged</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Sort By</label>
                          <Select value={filters.sortBy || "reportedAt"} onValueChange={v => setFilters(f => ({ ...f, sortBy: v }))}>
                            <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reportedAt">Reported At</SelectItem>
                              <SelectItem value="severity">Severity</SelectItem>
                              <SelectItem value="confidence">Confidence</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Sort Order</label>
                          <Select value={filters.sortOrder} onValueChange={v => setFilters(f => ({ ...f, sortOrder: v }))}>
                            <SelectTrigger><SelectValue placeholder="Sort order" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="desc">Descending</SelectItem>
                              <SelectItem value="asc">Ascending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Limit</label>
                          <Input type="number" min={1} max={100} value={filters.limit} onChange={e => setFilters(f => ({ ...f, limit: Number(e.target.value) }))} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={handleResetFilters}>Reset</Button>
                          <Button onClick={handleApplyFilters}>Apply</Button>
                        </div>
                      </div>
                    </ShadDialogContent>
                  </ShadDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpamReports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report._id}</TableCell>
                      <TableCell>{report.contentType}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>{report.severity}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>{report.detectionResult?.confidence ?? '-'}</TableCell>
                      <TableCell>{report.userReportDetails?.reason || report.detectionResult?.reasons?.join(', ') || '-'}</TableCell>
                      <TableCell>{report.reportedAt ? new Date(report.reportedAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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
                  {/* Placeholder for valid leads table */}
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

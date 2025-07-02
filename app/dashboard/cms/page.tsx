"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, Upload, ImageIcon, Globe, Star, MapPin, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import TestimonialMain from "@/src/components/Testimonial"
import CityMain from "@/src/components/City"
import FaqMain from "@/src/components/Faq"
import BannerMain from "@/src/components/Banner"
import { useAuthRedirect } from "@/hooks/use-Redirect"

const blogs = [
  {
    id: "BLG001",
    title: "Top 10 PG Accommodations in Mumbai",
    slug: "top-10-pg-mumbai",
    status: "published",
    author: "Admin",
    publishDate: "2024-01-15",
    views: 1250,
    category: "Guide",
    seoTitle: "Best PG in Mumbai | Top 10 Paying Guest Accommodations",
    metaDescription: "Discover the best PG accommodations in Mumbai with our comprehensive guide...",
  },
  {
    id: "BLG002",
    title: "Student Housing Guide for Pune",
    slug: "student-housing-pune-guide",
    status: "draft",
    author: "Admin",
    publishDate: "2024-01-20",
    views: 0,
    category: "Guide",
    seoTitle: "Student Housing in Pune | Complete Guide 2024",
    metaDescription: "Everything you need to know about student housing in Pune...",
  },
]

const banners = [
  {
    id: "BNR001",
    title: "Welcome to Vizima",
    subtitle: "Find Your Perfect PG/Hostel",
    image: "/placeholder.svg?height=200&width=800",
    link: "/properties",
    status: "active",
    position: "hero",
  },
  {
    id: "BNR002",
    title: "Special Offer",
    subtitle: "Get 20% off on first booking",
    image: "/placeholder.svg?height=200&width=800",
    link: "/offers",
    status: "active",
    position: "secondary",
  },
]

const cities = [
  { id: "mumbai", name: "Mumbai", properties: 24, active: true },
  { id: "pune", name: "Pune", properties: 18, active: true },
  { id: "delhi", name: "Delhi", properties: 32, active: true },
  { id: "bangalore", name: "Bangalore", properties: 28, active: true },
]

const testimonials = [
  {
    id: "TST001",
    name: "John Doe",
    rating: 5,
    comment: "Great service and amazing properties!",
    property: "Sunrise PG",
    status: "approved",
    date: "2024-01-15",
  },
  {
    id: "TST002",
    name: "Sarah Wilson",
    rating: 4,
    comment: "Very helpful staff and clean accommodations.",
    property: "Green Valley Hostel",
    status: "pending",
    date: "2024-01-16",
  },
]

function CreateBlogDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogDescription>Create a new blog post with SEO optimization</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <Input id="title" placeholder="Enter blog title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="tips">Tips</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" placeholder="Write your blog content..." rows={8} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input id="seoTitle" placeholder="SEO optimized title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" placeholder="Meta description for search engines" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" placeholder="pg, hostel, mumbai, accommodation" />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Featured Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload featured image</p>
              <Button variant="outline" className="mt-2">
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="publish" />
            <Label htmlFor="publish">Publish immediately</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Save as Draft
            </Button>
            <Button onClick={() => setOpen(false)}>Publish Blog</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CMSPage() {
  const [selectedTab, setSelectedTab] = useState("blogs")
  useAuthRedirect();
  return (
    <div className="space-y-6 mt-5 mx-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management System</h2>
          <p className="text-muted-foreground">Manage website content, blogs, and SEO settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
          <CreateBlogDialog />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="allbanners">Banners</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">Faqs</TabsTrigger>

          {/* <TabsTrigger value="pages">Static Pages</TabsTrigger> */}

        </TabsList>

        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Blog Posts</CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search blogs..." className="w-64" />
                  <CreateBlogDialog />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Publish Date</TableHead>
                    <TableHead>SEO</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{blog.title}</p>
                          <p className="text-sm text-muted-foreground">/{blog.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{blog.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.status === "published" ? "default" : "secondary"}>{blog.status}</Badge>
                      </TableCell>
                      <TableCell>{blog.views.toLocaleString()}</TableCell>
                      <TableCell>{blog.publishDate}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="text-green-600">✓ Title</div>
                          <div className="text-green-600">✓ Meta</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
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

        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Homepage Banners</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {banners.map((banner) => (
                  <Card key={banner.id}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{banner.title}</h3>
                            <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                          </div>
                          <Badge variant={banner.status === "active" ? "default" : "secondary"}>{banner.status}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{banner.position}</Badge>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="cities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>City Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add City
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{city.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{city.properties}</TableCell>
                      <TableCell>
                        <Badge variant={city.active ? "default" : "secondary"}>
                          {city.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>  */}


        <CityMain />



        <TestimonialMain />

        <FaqMain />

        <BannerMain />

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Static Pages</CardTitle>
              <CardDescription>Manage static pages like About, Contact, Terms, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {["About Us", "Contact", "Terms & Conditions", "Privacy Policy", "FAQ", "How it Works"].map((page) => (
                  <Card key={page}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{page}</h3>
                          <p className="text-sm text-muted-foreground">Last updated: Jan 15, 2024</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
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

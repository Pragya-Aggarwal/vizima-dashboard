"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Upload, ImageIcon, Globe, Settings } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
// Auth hook will be implemented later

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import FaqMain from "@/src/components/Faq"
import BannerMain from "@/src/components/Banner"
import CityMain from "@/src/components/City"
import TestimonialMain from "@/src/components/Testimonial"

// Local implementation of blog service
const createBlog = async (data: any) => {
  try {
    const formData = new FormData();

    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append('tags', JSON.stringify(value));
        } else if (key === 'featuredImage' && value instanceof File) {
          formData.append('featuredImage', value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await fetch('https://api.vizima.in/blogs', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create blog');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Sample blog data will be managed in component state

// Banners data will be managed in component state

// Cities data will be managed in component state

// Testimonials data will be managed in component state

interface BlogFormData {
  title: string
  category: string
  content: string
  seoTitle: string
  metaDescription: string
  tags: string
  isPublished: boolean
}

function CreateBlogDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      isPublished: true,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFeaturedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDialogClose = () => {
    reset()
    removeImage()
    setOpen(false)
  }

  const onSubmit = async (data: BlogFormData) => {
    if (!featuredImage) {
      toast.error('Please upload a featured image')
      return
    }

    try {
      setIsSubmitting(true)

      const formData = {
        title: data.title,
        content: data.content,
        category: data.category,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        isPublished: data.isPublished,
        featuredImage: featuredImage,
      }

      await createBlog(formData)

      toast.success('Blog post created successfully!')
      reset()
      removeImage()
      setOpen(false)
      // You might want to refresh the blog list here
    } catch (error) {
      console.error('Error creating blog:', error)
      toast.error('Failed to create blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleDialogClose()
      } else {
        setOpen(true)
      }
    }}>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title *</Label>
              <Input
                id="title"
                placeholder="Enter blog title"
                {...register('title', { required: 'Title is required' })}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select category</option>
                <option value="guide">Guide</option>
                <option value="news">News</option>
                <option value="tips">Tips</option>
                <option value="review">Review</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your blog content..."
              rows={8}
              {...register('content', { required: 'Content is required' })}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                placeholder="SEO optimized title"
                {...register('seoTitle')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="Meta description for search engines"
                rows={3}
                {...register('metaDescription')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="pg, hostel, mumbai, accommodation"
                {...register('tags')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Featured Image</Label>
            <input
              type="file"
              id="featured-image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage()
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="featured-image"
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center h-48"
              >
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (max. 5MB)</p>
              </label>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publish"
              className="hidden"
              {...register('isPublished')}
            />
            <Switch
              id="publish-switch"
              checked={true}
              onCheckedChange={(checked) => {
                // This is handled by the form submission
              }}
            />
            <Label htmlFor="publish">Publish immediately</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleSubmit((data) => {
                  onSubmit({ ...data, isPublished: false })
                })()
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Blog'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Blog interface
export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  views: number;
  publishDate: string;
  author?: string;
  seoTitle?: string;
  metaDescription?: string;
  content?: string;
  featuredImage?: string;
  tags?: string[];
}

// Blog View Dialog Component
function ViewBlogDialog({ blog, open, onOpenChange }: { blog: Blog | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  if (!blog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog.title}</DialogTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>By {blog.author || 'Admin'}</span>
            <span>•</span>
            <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </DialogHeader>

        <div className="prose max-w-none py-4">
          {blog.content ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p className="text-muted-foreground">No content available.</p>
          )}
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CMSPage() {
  const [selectedTab, setSelectedTab] = useState("allbanners");
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('https://api.vizima.in/blogs');
        // const data = await response.json();
        // setBlogs(data);

        // Mock data for now
        setBlogs([
          {
            id: '1',
            title: 'Sample Blog Post',
            slug: 'sample-blog-post',
            category: 'Technology',
            status: 'published',
            views: 1024,
            publishDate: '2023-05-15'
          },
          {
            id: '2',
            title: 'Another Blog Post',
            slug: 'another-blog-post',
            category: 'Lifestyle',
            status: 'draft',
            views: 0,
            publishDate: '2023-05-16'
          }
        ]);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs');
      }
    };

    fetchBlogs();
  }, []);

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    // You can open an edit dialog here or navigate to an edit page
    // For now, we'll just log it
    console.log('Editing blog:', blog);
    toast.info(`Editing: ${blog.title}`);
  };

  const handleViewBlog = (blog: Blog) => {
    setViewingBlog(blog);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        // Replace with your actual API call
        // await fetch(`https://api.vizima.in/blogs/${blogId}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        //   }
        // });

        // Update local state
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        toast.success('Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog =>
    (blog.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (blog.category?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (blog.status?.toLowerCase() || '').includes(search.toLowerCase())
  );

  // Mock data for other tabs
  const banners = [
    {
      id: '1',
      title: 'Summer Sale',
      subtitle: 'Get 20% off on all PGs',
      status: 'active',
      position: 'Top Banner'
    },
    {
      id: '2',
      title: 'New Locations',
      subtitle: 'Check out our new PGs in Mumbai',
      status: 'inactive',
      position: 'Middle Banner'
    }
  ];

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
          {/* <CreateBlogDialog /> */}
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          {/* <TabsTrigger value="blogs">Blogs</TabsTrigger> */}
          <TabsTrigger value="allbanners">Banners</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">Faqs</TabsTrigger>
          {/* <TabsTrigger value="pages">Static Pages</TabsTrigger> */}
        </TabsList>

        {/* Remove Blogs Tab Content */}
        {/* <TabsContent value="blogs" className="space-y-4"> ... </TabsContent> */}

        <TabsContent value="allbanners" className="space-y-4">
          <BannerMain />
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


        {/* City Management Section */}
        <TabsContent value="cities" className="space-y-4">
          <CityMain />
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials" className="space-y-4">
          <TestimonialMain />
        </TabsContent>

        {/* FAQ Section */}
        <TabsContent value="faqs" className="space-y-4">
          <FaqMain />
        </TabsContent>

        {/* Banners Section */}
        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banners</CardTitle>
              <CardDescription>Manage website banners and promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Banner management coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Static Pages Section */}
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

      {/* View Blog Dialog */}
      <ViewBlogDialog
        blog={viewingBlog}
        open={!!viewingBlog}
        onOpenChange={(open) => !open && setViewingBlog(null)}
      />
    </div>
  )
}

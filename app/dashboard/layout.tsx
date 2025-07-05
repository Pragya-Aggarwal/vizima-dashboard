"use client"

import type React from "react"
import ReactQueryProvider from "@/lib/reactQueryClient";
import { Toaster } from "sonner";


import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Suspense } from "react"
import Image from "next/image"
import { SearchProvider } from "../contexts/SearchContext"
import {
  Building2,
  Users,
  Calendar,
  // CreditCard,
  // BarChart3,
  Settings,
  HelpCircle,
  Home,
  Bell,
  Search,
  Menu,
  MessageSquare,
  FileText,
  Clock,
  Bot,
  User,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { AuthServices } from "@/src/services/AuthServices";
import { toast } from "sonner";


const sidebarItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
    description: "Overview & Analytics",
  },
  {
    icon: Building2,
    label: "Properties",
    href: "/dashboard/properties",
    // count: 24,
    description: "Manage PG/Hostel Listings",
  },
  {
    icon: Calendar,
    label: "Bookings",
    href: "/dashboard/bookings",
    // count: 12,
    description: "Booking Management",
  },
  {
    icon: Clock,
    label: "Appointments",
    href: "/dashboard/appointments",
    // count: 8,
    description: "Visit Slot Manager",
  },
  {
    icon: Users,
    label: "Users",
    href: "/dashboard/users",
    // count: 156,
    description: "User Management",
  },
  {
    icon: FileText,
    label: "CMS",
    href: "/dashboard/cms",
    description: "Content Management",
  },
  {
    icon: Bot,
    label: "Spam Detection",
    href: "/dashboard/spam",
    // count: 5,
    description: "AI Lead Management",
  },
  // {
  //   icon: MessageSquare,
  //   label: "Support Chat",
  //   href: "/dashboard/support",
  //   // count: 3,
  //   description: "Live Chat Panel",
  // },
  // {
  //   icon: CreditCard,
  //   label: "Payments",
  //   href: "/dashboard/payments",
  //   description: "Payment Gateway",
  // },
  // {
  //   icon: BarChart3,
  //   label: "Analytics",
  //   href: "/dashboard/analytics",
  //   description: "Reports & Insights",
  // },
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
    description: "System Configuration",
  },
]

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={`h-full bg-card ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6 px-2">
            <div className="logo-container">
              <Image src="/images/logo.png" alt="Vizima Logo" width={120} height={40} className="dark:brightness-150" />
            </div>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 btn-hover-effect",
                  pathname === item.href
                    ? "bg-primary/10 text-primary hover:bg-primary/20 border-l-2 border-primary nav-item-active"
                    : "hover:bg-accent",
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname === '/dashboard'
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New booking request", time: "5 min ago" },
    { id: 2, title: "Payment received", time: "1 hour ago" },
    { id: 3, title: "New user registered", time: "3 hours ago" },
    { id: 4, title: "Property updated", time: "4 hours ago" },
    { id: 5, title: "Booking cancelled", time: "5 hours ago" },
    { id: 6, title: "Support ticket opened", time: "6 hours ago" },
    { id: 7, title: "User upgraded plan", time: "7 hours ago" },
    { id: 8, title: "New review posted", time: "8 hours ago" },
    { id: 9, title: "Maintenance request", time: "9 hours ago" },
    { id: 10, title: "Admin login detected", time: "10 hours ago" },
  ])
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const currentPage = sidebarItems.find((item) => item.href === pathname)
  const [parsedUser, setParsedUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);


  useEffect(() => {
    const getUser = localStorage.getItem("admin-info");
    const user = getUser ? JSON.parse(getUser) : null;
    setParsedUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await AuthServices.logout()
      toast.success("LogOut successfully")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("admin-info")
      router.push("/")
    } catch (error) {
      toast.error("SomeThing went wrong!")
    }


  }

  return (
    <SearchProvider>
      <ReactQueryProvider>
        <div className="min-h-screen bg-background">
          <div className="flex">
            {/* Desktop Sidebar with full-height border */}
            <div className="hidden lg:block">
              <div className="w-64 border-r h-screen fixed left-0 top-0 bg-card z-30">
                <Sidebar />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 min-w-0">
              {/* Header */}
              <header className="bg-card border-b sticky top-0 z-40">
                <div className="px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="p-0 w-64">
                        <Sidebar />
                      </SheetContent>
                    </Sheet>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-bold truncate">
                        {pathname == "dashboard/property" ? "Property Detail" : currentPage?.label || "Dashboard"}
                      </h1>
                      <p className="text-muted-foreground text-sm sm:text-base truncate">
                        {pathname === "/dashboard/property"
                          ? "Overview of all properties including availability and pricing."
                          : currentPage?.description || "Welcome back, Admin!"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    {isDashboard && (
                      <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Searching ..."
                          className="pl-10 w-40 sm:w-48 md:w-56"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    )}

                    <ThemeToggle />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9">
                          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                          <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs">
                            {notifications.length}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80" align="end">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {!showAllNotifications ? (
                          <>
                            {notifications.slice(0, 5).map((notification) => (
                              <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                                <div>
                                  <p className="font-medium text-sm">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                                </div>
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="justify-center font-medium text-sm cursor-pointer"
                              onSelect={e => { e.preventDefault(); setShowAllNotifications(true); }}
                            >
                              View all notifications
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <div className="max-h-96 overflow-y-auto">
                              {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                                  <div>
                                    <p className="font-medium text-sm">{notification.title}</p>
                                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="justify-center font-medium text-sm cursor-pointer"
                              onSelect={e => { e.preventDefault(); setShowAllNotifications(false); }}
                            >
                              Back
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                            <AvatarImage src="/images/admin.jpg" alt="Admin" />
                            <AvatarFallback className="text-xs">AD</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{parsedUser?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{parsedUser?.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/dashboard/support")} className="cursor-pointer">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Support
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="p-4 sm:p-6 overflow-x-hidden">
                {children}
                <Toaster position="top-right" richColors />
              </main>
            </div>
          </div>
        </div>
      </ReactQueryProvider>
    </SearchProvider>
  )
}

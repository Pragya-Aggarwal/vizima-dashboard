"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, Bell, Lock, Globe, CreditCard, Mail, Phone, Shield, Database, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateSettings, getSettings } from "@/src/services/settings";
import axios from "@/src/lib/axiosInstance";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("general")
  const { toast } = useToast()

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    id: ""
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    loginAttempts: "5",
    sessionTimeout: "30",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    defaultGateway: "razorpay",
    autoCapture: true,
    refundPolicy: "7",
    currency: "INR",
  })

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: "30",
  })

  // Handle form submissions
  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      siteName: generalSettings.siteName,
      siteDescription: generalSettings.siteDescription,
      contactEmail: generalSettings.contactEmail,
      contactPhone: generalSettings.contactPhone,
      address: generalSettings.address,
    }
    try {
      await updateSettings(generalSettings.id, payload);
      toast({
        title: "Settings Updated",
        description: "General settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    }
  }

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings Updated",
      description: "Notification preferences have been saved successfully.",
    })
  }

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings Updated",
      description: "Security settings have been saved successfully.",
    })
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings Updated",
      description: "Payment settings have been saved successfully.",
    })
  }

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings Updated",
      description: "Backup settings have been saved successfully.",
    })
  }

  const triggerBackup = () => {
    toast({
      title: "Backup Started",
      description: "Manual backup has been initiated. This may take a few minutes.",
    })
  }

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await getSettings();
        // Adjust the following according to your API response structure

        setGeneralSettings({
          siteName: res?.data?.[0]?.siteName || "",
          siteDescription: res?.data?.[0]?.siteDescription || "",
          contactEmail: res?.data?.[0]?.contactEmail || "",
          contactPhone: res?.data?.[0]?.contactPhone || "",
          address: res?.data?.[0]?.address || "",
          id: res?.data?.[0]?._id,
        });
        // Repeat for other settings sections if needed
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch settings.",
          variant: "destructive",
        });
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6 mt-5 mx-5">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure your application settings and preferences</p>
      </div>

      {/* <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger> */}
      {/* <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger> */}
      {/* <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger> */}
      {/* <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment</span>
          </TabsTrigger> */}
      {/* <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Backup</span>
          </TabsTrigger> */}
      {/* </TabsList> */}

      {/* <TabsContent value="general" className="space-y-4"> */}
      <Card className="card-hover">
        <form onSubmit={handleGeneralSubmit}>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your site information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={3}
                value={generalSettings.address}
                onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="btn-hover-effect">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* </TabsContent> */}

      {/* <TabsContent value="notifications" className="space-y-4">
          <Card className="card-hover">
            <form onSubmit={handleNotificationSubmit}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bookingAlerts">Booking Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications for new and updated bookings</p>
                    </div>
                    <Switch
                      id="bookingAlerts"
                      checked={notificationSettings.bookingAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, bookingAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications for payments and refunds</p>
                    </div>
                    <Switch
                      id="paymentAlerts"
                      checked={notificationSettings.paymentAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, paymentAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="btn-hover-effect">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent> */}

      {/* <TabsContent value="security" className="space-y-4">
          <Card className="card-hover">
            <form onSubmit={handleSecuritySubmit}>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options for your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Run Security Audit
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="btn-hover-effect">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card className="card-hover">
            <form onSubmit={handlePaymentSubmit}>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment gateways and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultGateway">Default Payment Gateway</Label>
                    <Select
                      value={paymentSettings.defaultGateway}
                      onValueChange={(value) => setPaymentSettings({ ...paymentSettings, defaultGateway: value })}
                    >
                      <SelectTrigger id="defaultGateway">
                        <SelectValue placeholder="Select gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="razorpay">Razorpay</SelectItem>
                        <SelectItem value="payu">PayU</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={paymentSettings.currency}
                      onValueChange={(value) => setPaymentSettings({ ...paymentSettings, currency: value })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoCapture">Auto-Capture Payments</Label>
                    <p className="text-sm text-muted-foreground">Automatically capture authorized payments</p>
                  </div>
                  <Switch
                    id="autoCapture"
                    checked={paymentSettings.autoCapture}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, autoCapture: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refundPolicy">Refund Policy (days)</Label>
                  <Input
                    id="refundPolicy"
                    type="number"
                    value={paymentSettings.refundPolicy}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, refundPolicy: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">Number of days within which refunds are allowed</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="btn-hover-effect">
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card className="card-hover">
            <form onSubmit={handleBackupSubmit}>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <CardDescription>Configure database backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={backupSettings.backupFrequency}
                      onValueChange={(value) => setBackupSettings({ ...backupSettings, backupFrequency: value })}
                    >
                      <SelectTrigger id="backupFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={backupSettings.retentionPeriod}
                      onChange={(e) => setBackupSettings({ ...backupSettings, retentionPeriod: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={triggerBackup} type="button">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Manual Backup Now
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="btn-hover-effect">
                  <Save className="h-4 w-4 mr-2" />
                  Save Backup Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      // </Tabs> */}
    </div>
  )
}

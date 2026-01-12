"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Building2,
  Mail,
  Phone,
  Lock,
  CreditCard,
  Users,
  Key,
  Shield,
  Smartphone,
  Globe,
  Save,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
  Download,
  Trash2,
  Plus,
  Copy,
  LogOut,
  Bell,
  Palette,
  Globe2,
  ChevronDown,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type TabType = "profile" | "security" | "billing" | "team" | "api" | "notifications" | "preferences"

interface TeamMember {
  id: number
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  avatar: string
  status: "active" | "pending"
}

interface APIKey {
  id: number
  name: string
  key: string
  maskedKey: string
  type: "production" | "development"
  created: string
  lastUsed: string
}

interface PaymentMethod {
  id: number
  type: "card" | "paypal" | "bank"
  last4?: string
  brand?: string
  expiry?: string
  email?: string
  isDefault: boolean
}

interface Invoice {
  id: number
  date: string
  amount: string
  status: "paid" | "pending" | "failed"
  plan: string
}

interface Toast {
  id: number
  title: string
  description: string
  type: "success" | "error" | "warning" | "info"
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [toasts, setToasts] = useState<Toast[]>([])
  const router = useRouter()

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
    { id: "team" as const, label: "Team", icon: Users },
    { id: "api" as const, label: "API Keys", icon: Key },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
  ]

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out? All unsaved changes will be lost.")) {
      try {
        const supabase = getSupabaseBrowserClient()
        await supabase.auth.signOut()
        showToast({
          title: "Logged out",
          description: "You have been successfully logged out.",
          type: "success"
        })
        router.push("/login")
      } catch (error) {
        showToast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          type: "error"
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-in slide-in-from-right-5 fade-in duration-300 ${
              toast.type === "success"
                ? "bg-success/10 border-success/20 text-success"
                : toast.type === "error"
                ? "bg-destructive/10 border-destructive/20 text-destructive"
                : toast.type === "warning"
                ? "bg-warning/10 border-warning/20 text-warning"
                : "bg-info/10 border-info/20 text-info"
            } border rounded-lg p-4 max-w-sm shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                {toast.type === "success" && <CheckCircle2 className="w-4 h-4 mt-0.5" />}
                {toast.type === "error" && <X className="w-4 h-4 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium">{toast.title}</p>
                  <p className="text-xs opacity-80 mt-0.5">{toast.description}</p>
                </div>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <Card className="lg:col-span-1 p-2 border-0 shadow-sm h-fit sticky top-20">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Danger Zone */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </Card>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "profile" && <ProfileTab showToast={showToast} />}
              {activeTab === "security" && <SecurityTab showToast={showToast} />}
              {activeTab === "billing" && <BillingTab showToast={showToast} />}
              {activeTab === "team" && <TeamTab showToast={showToast} />}
              {activeTab === "api" && <APITab showToast={showToast} />}
              {activeTab === "notifications" && <NotificationsTab showToast={showToast} />}
              {activeTab === "preferences" && <PreferencesTab showToast={showToast} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface TabProps {
  showToast: (toast: Omit<Toast, 'id'>) => void
}

function ProfileTab({ showToast }: TabProps) {
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    website: "https://techcorp.com",
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showToast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
              SC
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                Remove
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="firstName" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="pl-10" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="pl-10" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="pl-10" 
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Company Information</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="company" 
                value={profileData.company}
                onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                className="pl-10" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="website" 
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                className="pl-10" 
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>
    </>
  )
}

function SecurityTab({ showToast }: TabProps) {
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast({
        title: "Error",
        description: "Passwords do not match.",
        type: "error"
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      showToast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        type: "error"
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showToast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
        type: "success"
      })
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handle2FAToggle = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setTwoFactorEnabled(!twoFactorEnabled)
      
      showToast({
        title: twoFactorEnabled ? "2FA disabled" : "2FA enabled",
        description: twoFactorEnabled 
          ? "Two-factor authentication has been disabled." 
          : "Two-factor authentication has been enabled.",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to update 2FA settings. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="currentPassword" 
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="pl-10 pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="newPassword" 
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="pl-10 pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="pl-10 pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button onClick={handlePasswordChange} disabled={loading} className="gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
              twoFactorEnabled 
                ? "bg-success/10 text-success" 
                : "bg-muted text-muted-foreground"
            }`}>
              {twoFactorEnabled ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handle2FAToggle}
              disabled={loading}
            >
              {twoFactorEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">Use an app to generate codes</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {twoFactorEnabled ? "Manage" : "Setup"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-success/5 to-transparent border-success/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-success">Security Status: Excellent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account is well protected with 2FA enabled and a strong password. Keep up the good security
              practices!
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Active Sessions</h2>
        <div className="space-y-3">
          {[
            { device: "Chrome on Windows", location: "New York, USA", lastActive: "Now", current: true },
            { device: "Safari on iPhone", location: "New York, USA", lastActive: "2 hours ago", current: false },
            { device: "Firefox on Mac", location: "London, UK", lastActive: "5 days ago", current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{session.device}</p>
                  {session.current && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">Current</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{session.location} • Last active: {session.lastActive}</p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  Logout
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function BillingTab({ showToast }: TabProps) {
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState("professional")
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, type: "card", last4: "4242", brand: "Visa", expiry: "12/2025", isDefault: true },
    { id: 2, type: "paypal", email: "sarah@company.com", isDefault: false },
  ])
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, date: "Dec 1, 2024", amount: "$99.00", status: "paid", plan: "Professional" },
    { id: 2, date: "Nov 1, 2024", amount: "$99.00", status: "paid", plan: "Professional" },
    { id: 3, date: "Oct 1, 2024", amount: "$99.00", status: "paid", plan: "Professional" },
  ])

  const plans = [
    { id: "starter", name: "Starter", price: "$29", features: ["Up to 1,000 transactions", "Basic analytics", "Email support"] },
    { id: "professional", name: "Professional", price: "$99", features: ["Unlimited transactions", "Advanced analytics", "Priority support", "Up to 5 users"] },
    { id: "enterprise", name: "Enterprise", price: "$299", features: ["Everything in Professional", "Custom integrations", "Dedicated account manager", "Unlimited users"] },
  ]

  const handlePlanChange = async (planId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentPlan(planId)
      
      showToast({
        title: "Plan updated",
        description: `You have been upgraded to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefaultPayment = (id: number) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }))
    setPaymentMethods(updatedMethods)
    
    showToast({
      title: "Default payment updated",
      description: "Your default payment method has been updated.",
      type: "success"
    })
  }

  const handleRemovePayment = (id: number) => {
    if (paymentMethods.find(m => m.id === id)?.isDefault) {
      showToast({
        title: "Cannot remove",
        description: "Cannot remove the default payment method. Set another as default first.",
        type: "error"
      })
      return
    }
    
    setPaymentMethods(paymentMethods.filter(m => m.id !== id))
    showToast({
      title: "Payment method removed",
      description: "The payment method has been removed.",
      type: "success"
    })
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    showToast({
      title: "Invoice downloaded",
      description: `Invoice ${invoice.id} has been downloaded.`,
      type: "success"
    })
    // In real app, trigger actual download
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose the plan that fits your needs</p>
          </div>
          <Button variant="outline" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Plan"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`p-6 border-2 transition-all cursor-pointer hover:border-primary ${
                currentPlan === plan.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handlePlanChange(plan.id)}
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">{plan.name} Plan</h3>
              <ul className="space-y-2 text-sm mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={currentPlan === plan.id ? "default" : "outline"}
              >
                {currentPlan === plan.id ? "Current Plan" : "Select Plan"}
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your payment methods</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">
                    {method.type === "card" ? `${method.brand} •••• ${method.last4}` : 
                     method.type === "paypal" ? `PayPal • ${method.email}` : "Bank Transfer"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {method.type === "card" ? `Expires ${method.expiry}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSetDefaultPayment(method.id)}
                  >
                    Set Default
                  </Button>
                ) : (
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Default
                  </span>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemovePayment(method.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Billing History</h2>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{invoice.date}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === "paid" ? "bg-success/10 text-success" :
                    invoice.status === "pending" ? "bg-warning/10 text-warning" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{invoice.plan} Plan</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">{invoice.amount}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDownloadInvoice(invoice)}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="billingEmail">Billing Email</Label>
            <Input id="billingEmail" defaultValue="billing@techcorp.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Input id="billingAddress" defaultValue="123 Business St, New York, NY 10001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT</Label>
            <Input id="taxId" defaultValue="US-123456789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>INR (₹)</option>
            </select>
          </div>
        </div>
      </Card>
    </>
  )
}

function TeamTab({ showToast }: TabProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "Sarah Chen", email: "sarah.chen@company.com", role: "Owner", avatar: "SC", status: "active" },
    { id: 2, name: "Michael Rodriguez", email: "michael.r@company.com", role: "Admin", avatar: "MR", status: "active" },
    { id: 3, name: "Emily Thompson", email: "emily.t@company.com", role: "Member", avatar: "ET", status: "active" },
    { id: 4, name: "David Lee", email: "david.l@company.com", role: "Member", avatar: "DL", status: "pending" },
  ])

  const [inviteEmail, setInviteEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInvite = async () => {
    if (!inviteEmail.includes("@")) {
      showToast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        type: "error"
      })
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newMember: TeamMember = {
        id: teamMembers.length + 1,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: "Member",
        avatar: inviteEmail[0].toUpperCase(),
        status: "pending"
      }
      
      setTeamMembers([...teamMembers, newMember])
      setInviteEmail("")
      
      showToast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`,
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (id: number, role: TeamMember["role"]) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, role } : member
    ))
    
    showToast({
      title: "Role updated",
      description: "Team member role has been updated.",
      type: "success"
    })
  }

  const handleRemoveMember = (id: number) => {
    const member = teamMembers.find(m => m.id === id)
    if (member?.role === "Owner") {
      showToast({
        title: "Cannot remove owner",
        description: "You cannot remove the account owner from the team.",
        type: "error"
      })
      return
    }
    
    setTeamMembers(teamMembers.filter(m => m.id !== id))
    showToast({
      title: "Member removed",
      description: "Team member has been removed.",
      type: "success"
    })
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your team and their permissions</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Input 
                placeholder="email@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="pr-24"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1 h-8"
                onClick={handleInvite}
                disabled={loading || !inviteEmail}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.name}</p>
                    {member.status === "pending" && (
                      <span className="px-2 py-0.5 bg-warning/10 text-warning rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMember["role"])}
                  disabled={member.role === "Owner"}
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
                {member.role !== "Owner" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground pb-3 border-b">
            <div>Permission</div>
            <div className="text-center">Admin</div>
            <div className="text-center">Member</div>
          </div>
          {[
            { name: "View dashboard", admin: true, member: true },
            { name: "Manage transactions", admin: true, member: true },
            { name: "Create invoices", admin: true, member: true },
            { name: "Manage budgets", admin: true, member: false },
            { name: "Access settings", admin: true, member: false },
            { name: "Manage team", admin: true, member: false },
            { name: "View analytics", admin: true, member: true },
            { name: "Export data", admin: true, member: true },
          ].map((permission, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 text-sm items-center">
              <div>{permission.name}</div>
              <div className="text-center">
                {permission.admin && <CheckCircle2 className="w-5 h-5 text-success mx-auto" />}
              </div>
              <div className="text-center">
                {permission.member && <CheckCircle2 className="w-5 h-5 text-success mx-auto" />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function APITab({ showToast }: TabProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    { id: 1, name: "Production API Key", key: "sk_live_1234567890abcdef", maskedKey: "sk_live_••••••••••••", type: "production", created: "Dec 1, 2024", lastUsed: "2 hours ago" },
    { id: 2, name: "Development API Key", key: "sk_test_abcdef1234567890", maskedKey: "sk_test_••••••••••••", type: "development", created: "Nov 15, 2024", lastUsed: "1 day ago" },
  ])
  const [newKeyName, setNewKeyName] = useState("")
  const [showKey, setShowKey] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      showToast({
        title: "Name required",
        description: "Please enter a name for the API key.",
        type: "error"
      })
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newKey: APIKey = {
        id: apiKeys.length + 1,
        name: newKeyName,
        key: `sk_${Math.random().toString(36).substring(2)}_${Math.random().toString(36).substring(2)}`,
        maskedKey: `sk_••••••••••••••••`,
        type: "development",
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastUsed: "Never"
      }
      
      setApiKeys([...apiKeys, newKey])
      setNewKeyName("")
      setShowKey(newKey.id)
      
      showToast({
        title: "API Key Created",
        description: "Your new API key has been generated. Copy it now as it won't be shown again.",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    showToast({
      title: "Copied",
      description: "API key copied to clipboard.",
      type: "success"
    })
  }

  const handleRevokeKey = (id: number) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return
    }
    
    setApiKeys(apiKeys.filter(key => key.id !== id))
    showToast({
      title: "API Key Revoked",
      description: "The API key has been revoked and can no longer be used.",
      type: "success"
    })
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">API Keys</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your API keys for programmatic access</p>
          </div>
          <div className="flex gap-3">
            <Input 
              placeholder="New key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-48"
            />
            <Button 
              onClick={handleCreateKey} 
              disabled={loading || !newKeyName}
              className="gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              Create Key
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{apiKey.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      apiKey.type === "production" 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-warning/10 text-warning"
                    }`}>
                      {apiKey.type === "production" ? "Production" : "Development"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {showKey === apiKey.id ? apiKey.key : apiKey.maskedKey}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {apiKey.created} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => showKey === apiKey.id ? setShowKey(null) : setShowKey(apiKey.id)}
                  >
                    {showKey === apiKey.id ? "Hide" : "Show"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => handleCopyKey(apiKey.key)}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRevokeKey(apiKey.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Learn how to integrate Finflow into your applications using our REST API. Access comprehensive documentation,
          code examples, and guides.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Globe2 className="w-4 h-4" />
            View Documentation
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download SDK
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-destructive/5 to-transparent border-destructive/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-destructive">Security Warning</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Never share your API keys publicly or commit them to version control. Keep them secure to protect your
              account. Revoke any keys that may have been compromised.
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}

function NotificationsTab({ showToast }: TabProps) {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: {
      billing: true,
      security: true,
      updates: false,
      marketing: false,
    },
    push: {
      billing: true,
      security: true,
      updates: false,
    },
    slack: {
      alerts: true,
    }
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-4 text-lg">Email Notifications</h3>
            <div className="space-y-4">
              {Object.entries(notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {key === 'billing' && 'Receive invoices and payment receipts'}
                      {key === 'security' && 'Security alerts and login notifications'}
                      {key === 'updates' && 'Product updates and new features'}
                      {key === 'marketing' && 'Newsletters and promotional offers'}
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        email: { ...notifications.email, [key]: e.target.checked }
                      })}
                      className="sr-only peer"
                      id={`email-${key}`}
                    />
                    <label
                      htmlFor={`email-${key}`}
                      className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary cursor-pointer block relative"
                    >
                      <span className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="font-medium mb-4 text-lg">Push Notifications</h3>
            <div className="space-y-4">
              {Object.entries(notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {key === 'billing' && 'Payment reminders and receipts'}
                      {key === 'security' && 'Security alerts and login attempts'}
                      {key === 'updates' && 'Important updates and announcements'}
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        push: { ...notifications.push, [key]: e.target.checked }
                      })}
                      className="sr-only peer"
                      id={`push-${key}`}
                    />
                    <label
                      htmlFor={`push-${key}`}
                      className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary cursor-pointer block relative"
                    >
                      <span className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="font-medium mb-4 text-lg">Slack Integration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alerts and Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive important alerts in your Slack workspace
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notifications.slack.alerts}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      slack: { alerts: e.target.checked }
                    })}
                    className="sr-only peer"
                    id="slack-alerts"
                  />
                  <label
                    htmlFor="slack-alerts"
                    className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary cursor-pointer block relative"
                  >
                    <span className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-6"></span>
                  </label>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Connect Slack Workspace
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Preferences
        </Button>
      </div>
    </>
  )
}

function PreferencesTab({ showToast }: TabProps) {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    theme: "system",
    autoLogout: 30,
    exportFormat: "csv",
  })

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
  ]

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Dubai",
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast({
        title: "Preferences saved",
        description: "Your preferences have been updated.",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">General Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select 
              id="language"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select 
              id="timezone"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.timezone}
              onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <select 
              id="dateFormat"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.dateFormat}
              onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select 
              id="currency"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.currency}
              onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="INR">Indian Rupee (INR)</option>
              <option value="JPY">Japanese Yen (JPY)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select 
              id="theme"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.theme}
              onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoLogout">Auto-logout (minutes)</Label>
            <select 
              id="autoLogout"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.autoLogout}
              onChange={(e) => setPreferences({...preferences, autoLogout: parseInt(e.target.value)})}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Data & Export</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="exportFormat">Default Export Format</Label>
            <select 
              id="exportFormat"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={preferences.exportFormat}
              onChange={(e) => setPreferences({...preferences, exportFormat: e.target.value})}
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Data Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2 justify-start">
                <Download className="w-4 h-4" />
                Export All Data
              </Button>
              <Button variant="outline" className="gap-2 justify-start">
                <Calendar className="w-4 h-4" />
                Schedule Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-destructive">Danger Zone</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="gap-2 justify-start text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
                    showToast({
                      title: "Data deletion requested",
                      description: "Your data deletion request has been submitted.",
                      type: "success"
                    })
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete All Data
              </Button>
              <p className="text-xs text-muted-foreground">
                This will permanently delete all your account data including transactions, invoices, and settings.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Preferences
        </Button>
      </div>
    </>
  )
}
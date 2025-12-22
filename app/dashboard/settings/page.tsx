"use client"

import { useState } from "react"
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
} from "lucide-react"

type TabType = "profile" | "security" | "billing" | "team" | "api"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
    { id: "team" as const, label: "Team", icon: Users },
    { id: "api" as const, label: "API Keys", icon: Key },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <Card className="lg:col-span-1 p-2 border-0 shadow-sm h-fit">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "billing" && <BillingTab />}
              {activeTab === "team" && <TeamTab />}
              {activeTab === "api" && <APITab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProfileTab() {
  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-semibold">
              SC
            </div>
            <div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="firstName" defaultValue="Sarah" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Chen" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="sarah.chen@company.com" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="pl-10" />
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
              <Input id="company" defaultValue="TechCorp Inc." className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="website" defaultValue="https://techcorp.com" className="pl-10" />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </>
  )
}

function SecurityTab() {
  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="currentPassword" type="password" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="newPassword" type="password" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" className="pl-10" />
            </div>
          </div>

          <Button>Update Password</Button>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Enabled
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
              Manage
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-accent/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Security Status: Excellent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account is well protected with 2FA enabled and a strong password. Keep up the good security
              practices!
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}

function BillingTab() {
  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">You are currently on the Professional plan</p>
          </div>
          <Button variant="outline">Change Plan</Button>
        </div>

        <div className="p-6 border rounded-xl bg-gradient-to-br from-accent/5 to-transparent">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">$99</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Professional Plan</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Unlimited transactions
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Advanced analytics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Up to 5 users
            </li>
          </ul>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your payment methods</p>
          </div>
          <Button variant="outline" size="sm">
            Add New
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">Default</span>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: "Dec 1, 2024", amount: "$99.00", status: "Paid" },
            { date: "Nov 1, 2024", amount: "$99.00", status: "Paid" },
            { date: "Oct 1, 2024", amount: "$99.00", status: "Paid" },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-sm text-muted-foreground">{invoice.status}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">{invoice.amount}</p>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function TeamTab() {
  const teamMembers = [
    { name: "Sarah Chen", email: "sarah.chen@company.com", role: "Owner", avatar: "SC" },
    { name: "Michael Rodriguez", email: "michael.r@company.com", role: "Admin", avatar: "MR" },
    { name: "Emily Thompson", email: "emily.t@company.com", role: "Member", avatar: "ET" },
    { name: "David Lee", email: "david.l@company.com", role: "Member", avatar: "DL" },
  ]

  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your team and their permissions</p>
          </div>
          <Button className="gap-2">
            <Users className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
                  <option>{member.role}</option>
                  <option>Admin</option>
                  <option>Member</option>
                </select>
                {member.role !== "Owner" && (
                  <Button variant="ghost" size="sm">
                    Remove
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
            { name: "Manage budgets", admin: true, member: false },
            { name: "Access settings", admin: true, member: false },
            { name: "Manage team", admin: true, member: false },
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

function APITab() {
  return (
    <>
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">API Keys</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your API keys for programmatic access</p>
          </div>
          <Button className="gap-2">
            <Key className="w-4 h-4" />
            Create API Key
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Production API Key</p>
              <p className="text-sm text-muted-foreground mt-1 font-mono">sk_live_••••••••••••••••</p>
              <p className="text-xs text-muted-foreground mt-2">Created Dec 1, 2024 • Last used 2 hours ago</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="ghost" size="sm">
                Revoke
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Development API Key</p>
              <p className="text-sm text-muted-foreground mt-1 font-mono">sk_test_••••••••••••••••</p>
              <p className="text-xs text-muted-foreground mt-2">Created Nov 15, 2024 • Last used 1 day ago</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="ghost" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Learn how to integrate Finflow into your applications using our REST API. Access comprehensive documentation,
          code examples, and guides.
        </p>
        <Button variant="outline">View Documentation</Button>
      </Card>

      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-destructive/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-destructive">Security Warning</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Never share your API keys publicly or commit them to version control. Keep them secure to protect your
              account.
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}

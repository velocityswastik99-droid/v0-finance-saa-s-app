"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, FileText, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react"

const invoices = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 15000,
    status: "paid",
    dueDate: "Dec 20, 2024",
    issueDate: "Dec 5, 2024",
  },
  {
    id: "INV-002",
    client: "Tech Solutions Inc",
    amount: 8500,
    status: "paid",
    dueDate: "Dec 18, 2024",
    issueDate: "Dec 3, 2024",
  },
  {
    id: "INV-003",
    client: "GlobalTech Ltd",
    amount: 12000,
    status: "pending",
    dueDate: "Dec 25, 2024",
    issueDate: "Dec 10, 2024",
  },
  {
    id: "INV-004",
    client: "Startup Inc",
    amount: 22000,
    status: "pending",
    dueDate: "Dec 28, 2024",
    issueDate: "Dec 13, 2024",
  },
  {
    id: "INV-005",
    client: "Digital Agency",
    amount: 6700,
    status: "overdue",
    dueDate: "Dec 10, 2024",
    issueDate: "Nov 25, 2024",
  },
  {
    id: "INV-006",
    client: "Innovate Co",
    amount: 18500,
    status: "draft",
    dueDate: "Jan 5, 2025",
    issueDate: "Dec 20, 2024",
  },
]

const stats = [
  { label: "Total Outstanding", value: "$59,200", icon: Clock, color: "text-chart-4" },
  { label: "Paid This Month", value: "$23,500", icon: CheckCircle2, color: "text-success" },
  { label: "Overdue", value: "$6,700", icon: AlertCircle, color: "text-destructive" },
]

const getStatusStyle = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-success/10 text-success"
    case "pending":
      return "bg-chart-4/10 text-chart-4"
    case "overdue":
      return "bg-destructive/10 text-destructive"
    case "draft":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return CheckCircle2
    case "pending":
      return Clock
    case "overdue":
      return AlertCircle
    case "draft":
      return FileText
    default:
      return FileText
  }
}

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Invoices</h1>
              <p className="text-muted-foreground mt-1">Create and manage customer invoices</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Search */}
          <Card className="p-4 border-0 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-10 bg-background/50" />
            </div>
          </Card>

          {/* Invoices List */}
          <div className="grid grid-cols-1 gap-4">
            {invoices.map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status)
              return (
                <Card key={invoice.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{invoice.id}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {invoice.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.client}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Issued: {invoice.issueDate}</span>
                          <span>Due: {invoice.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">${invoice.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        {invoice.status === "draft" && (
                          <Button size="icon" className="rounded-full">
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

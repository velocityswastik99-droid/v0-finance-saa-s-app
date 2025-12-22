"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useInvoices } from "@/hooks/use-invoices"
import { useCurrency } from "@/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"
import { useState } from "react"
import { Search, Plus, Download, FileText, Send, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

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
  const { invoices, isLoading } = useInvoices()
  const { currency } = useCurrency()
  const [searchQuery, setSearchQuery] = useState("")

  const stats = {
    totalOutstanding:
      invoices?.filter((i) => i.status === "pending").reduce((sum, i) => sum + Number(i.amount), 0) || 0,
    totalPaid: invoices?.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.amount), 0) || 0,
    totalOverdue: invoices?.filter((i) => i.status === "overdue").reduce((sum, i) => sum + Number(i.amount), 0) || 0,
  }

  const filteredInvoices =
    invoices?.filter(
      (i) =>
        i.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.client_name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const statsDisplay = [
    {
      label: "Total Outstanding",
      value: formatCurrency(stats.totalOutstanding, currency),
      icon: Clock,
      color: "text-chart-4",
    },
    {
      label: "Paid This Month",
      value: formatCurrency(stats.totalPaid, currency),
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      label: "Overdue",
      value: formatCurrency(stats.totalOverdue, currency),
      icon: AlertCircle,
      color: "text-destructive",
    },
  ]

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
            {statsDisplay.map((stat, i) => (
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
              <Input
                placeholder="Search invoices..."
                className="pl-10 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          {/* Invoices List */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <Card className="p-12 border-0 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium mb-1">No invoices found</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first invoice to get started</p>
                <Button className="gap-2 rounded-full">
                  <Plus className="w-4 h-4" />
                  Create Invoice
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredInvoices.map((invoice) => {
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
                            <h3 className="font-semibold">{invoice.invoice_number}</h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {invoice.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{invoice.client_name}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>
                              Issued:{" "}
                              {new Date(invoice.issue_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span>
                              Due:{" "}
                              {new Date(invoice.due_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatCurrency(Number(invoice.amount), currency)}</p>
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
          )}
        </div>
      </main>
    </div>
  )
}

"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useInvoices } from "@/hooks/use-invoices"
import { useCurrency } from "@/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"
import { useState, useEffect } from "react"
import { Search, Download, FileText, Send, Clock, CheckCircle2, AlertCircle, Loader2, Printer, X } from "lucide-react"
import { AddInvoiceDialog } from "@/components/add-invoice-dialog"
import { generateInvoicePDF } from "@/lib/pdf-generator"

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
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' })

  const stats = {
    totalOutstanding:
      invoices?.filter((i) => i.status === "sent").reduce((sum, i) => sum + Number(i.amount), 0) || 0,
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

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: 'success', message: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification.show])

  const handleDownloadPDF = async (invoice: any) => {
    setGeneratingPDF(invoice.id)
    try {
      // Prepare invoice data for PDF
      const pdfData = {
        invoice_number: invoice.invoice_number,
        issue_date: new Date(invoice.issue_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        due_date: new Date(invoice.due_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        client_name: invoice.client_name,
        client_email: invoice.client_email,
        client_address: invoice.client_address || "N/A",
        company_name: "Finflow Inc.",
        company_email: "billing@finflow.com",
        company_address: "123 Financial St, Suite 100\nNew York, NY 10001",
        items: invoice.items || [
          { 
            description: invoice.description || "Professional Services", 
            quantity: 1, 
            unit_price: Number(invoice.amount),
            amount: Number(invoice.amount) 
          }
        ],
        subtotal: Number(invoice.amount),
        tax_rate: 0,
        tax_amount: 0,
        total: Number(invoice.amount),
        currency: currency,
        notes: invoice.notes || "Thank you for your business!",
        status: invoice.status,
        payment_method: "Bank Transfer",
        payment_instructions: `Please transfer the amount to:\nBank: Finflow Bank\nAccount: 1234567890\nRouting: 021000021\nReference: ${invoice.invoice_number}`
      }

      await generateInvoicePDF(pdfData)
      
      setNotification({
        show: true,
        type: 'success',
        message: `Invoice ${invoice.invoice_number} downloaded successfully!`
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      setNotification({
        show: true,
        type: 'error',
        message: "Failed to generate PDF. Please try again."
      })
    } finally {
      setGeneratingPDF(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Notification Toast */}
          {notification.show && (
            <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300 ${
              notification.type === 'success' 
                ? 'bg-success/10 border-success/20 text-success' 
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            } border rounded-lg p-4 max-w-sm shadow-lg backdrop-blur-sm`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
                <button 
                  onClick={() => setNotification({ show: false, type: 'success', message: '' })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Invoices</h1>
              <p className="text-muted-foreground mt-1">Create and manage customer invoices</p>
            </div>
            <AddInvoiceDialog />
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
                <AddInvoiceDialog />
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredInvoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status)
                return (
                  <Card key={invoice.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                          <FileText className="w-6 h-6 text-primary" />
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {invoice.status === "paid" 
                              ? "Paid" 
                              : invoice.status === "overdue" 
                                ? "Overdue" 
                                : "Due soon"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDownloadPDF(invoice)}
                            disabled={generatingPDF === invoice.id}
                            className="relative hover:bg-primary hover:text-primary-foreground transition-all group/btn"
                          >
                            {generatingPDF === invoice.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                                  Download PDF
                                </span>
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="hover:bg-accent hover:text-accent-foreground"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          {invoice.status === "draft" && (
                            <Button size="icon" className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
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

          {/* Quick Action Card */}
          <Card className="p-6 border-0 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Need to generate multiple invoices?</h3>
                <p className="text-sm text-muted-foreground">
                  Export all your invoices as PDFs or share them directly with clients.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Bulk export logic
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Share with Team
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
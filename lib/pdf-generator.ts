// lib/pdf-generator.ts - Simplified version
import jsPDF from 'jspdf'

interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

interface InvoicePDFData {
  invoice_number: string
  issue_date: string
  due_date: string
  client_name: string
  client_email: string
  client_address: string
  company_name: string
  company_email: string
  company_address: string
  items: InvoiceItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  currency: string
  notes: string
  status: string
}

export async function generateInvoicePDF(data: InvoicePDFData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let yPos = 20
      
      // Title
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(59, 130, 246)
      doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' })
      
      yPos += 10
      
      // Invoice details
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.text(`Invoice #: ${data.invoice_number}`, margin, yPos)
      doc.text(`Status: ${data.status.toUpperCase()}`, pageWidth - margin, yPos, { align: 'right' })
      
      yPos += 10
      doc.text(`Issue Date: ${data.issue_date}`, margin, yPos)
      doc.text(`Due Date: ${data.due_date}`, pageWidth - margin, yPos, { align: 'right' })
      
      yPos += 20
      
      // Company info
      doc.setFont('helvetica', 'bold')
      doc.text('FROM:', margin, yPos)
      doc.text('TO:', pageWidth / 2, yPos)
      
      yPos += 8
      doc.setFont('helvetica', 'normal')
      doc.text(data.company_name, margin, yPos)
      doc.text(data.client_name, pageWidth / 2, yPos)
      
      yPos += 7
      doc.text(data.company_email, margin, yPos)
      doc.text(data.client_email, pageWidth / 2, yPos)
      
      yPos += 15
      
      // Items table header
      doc.setFont('helvetica', 'bold')
      doc.text('Description', margin, yPos)
      doc.text('Qty', pageWidth - 120, yPos)
      doc.text('Unit Price', pageWidth - 80, yPos)
      doc.text('Amount', pageWidth - margin, yPos, { align: 'right' })
      
      yPos += 10
      doc.setFont('helvetica', 'normal')
      
      // Items
      data.items.forEach((item, index) => {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }
        
        doc.text(item.description, margin, yPos)
        doc.text(item.quantity.toString(), pageWidth - 120, yPos)
        doc.text(formatCurrency(item.unit_price, data.currency, false), pageWidth - 80, yPos)
        doc.text(formatCurrency(item.amount, data.currency, false), pageWidth - margin, yPos, { align: 'right' })
        yPos += 10
      })
      
      yPos += 10
      
      // Totals
      doc.setFont('helvetica', 'bold')
      doc.text('Subtotal:', pageWidth - 100, yPos)
      doc.text(formatCurrency(data.subtotal, data.currency, false), pageWidth - margin, yPos, { align: 'right' })
      
      if (data.tax_rate > 0) {
        yPos += 10
        doc.text(`Tax (${data.tax_rate}%):`, pageWidth - 100, yPos)
        doc.text(formatCurrency(data.tax_amount, data.currency, false), pageWidth - margin, yPos, { align: 'right' })
      }
      
      yPos += 15
      doc.setFontSize(14)
      doc.text('TOTAL:', pageWidth - 100, yPos)
      doc.text(formatCurrency(data.total, data.currency, false), pageWidth - margin, yPos, { align: 'right' })
      
      // Notes
      yPos += 25
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Notes:', margin, yPos)
      
      yPos += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const notes = doc.splitTextToSize(data.notes, pageWidth - 40)
      notes.forEach((line: string) => {
        doc.text(line, margin, yPos)
        yPos += 7
      })
      
      // Footer
      yPos += 10
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('Thank you for your business!', pageWidth / 2, yPos, { align: 'center' })
      
      // Save PDF
      doc.save(`invoice-${data.invoice_number}.pdf`)
      resolve()
    } catch (error) {
      console.error('PDF generation error:', error)
      reject(error)
    }
  })
}

function formatCurrency(amount: number, currency: string, withSymbol: boolean = true): string {
  try {
    if (currency === 'INR') {
      return withSymbol ? `₹${amount.toFixed(2)}` : amount.toFixed(2)
    } else {
      return withSymbol ? `$${amount.toFixed(2)}` : amount.toFixed(2)
    }
  } catch {
    return amount.toFixed(2)
  }
}
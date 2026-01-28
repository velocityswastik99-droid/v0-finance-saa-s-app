"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/lib/supabase/types"

interface EditTransactionDialogProps {
  transaction: Transaction
  onUpdate?: () => void
}

export function EditTransactionDialog({ transaction, onUpdate }: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase
        .from("transactions")
        .update({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          amount: Number.parseFloat(formData.get("amount") as string),
          type: formData.get("type") as string,
          category: formData.get("category") as string,
          date: formData.get("date") as string,
          status: formData.get("status") as string,
        })
        .eq("id", transaction.id)

      if (error) {
        console.error("[v0] Transaction update error:", error.message)
        alert(`Failed to update transaction: ${error.message}`)
        setLoading(false)
        return
      }

      setOpen(false)
      onUpdate?.()
      router.refresh()
    } catch (err) {
      console.error("[v0] Transaction update submission error:", err)
      alert("An unexpected error occurred while updating the transaction")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      return
    }

    setDeleting(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("transactions").delete().eq("id", transaction.id)

      if (error) {
        console.error("[v0] Transaction delete error:", error.message)
        alert(`Failed to delete transaction: ${error.message}`)
        setDeleting(false)
        return
      }

      setOpen(false)
      onUpdate?.()
      router.refresh()
    } catch (err) {
      console.error("[v0] Transaction delete submission error:", err)
      alert("An unexpected error occurred while deleting the transaction")
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent hover:bg-muted">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Update transaction details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Transaction Name</Label>
            <Input id="name" name="name" defaultValue={transaction.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" name="description" defaultValue={transaction.description || ""} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={transaction.amount}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={transaction.type} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={transaction.category} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={transaction.date} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={transaction.status} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || deleting}
              className="gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {!deleting && <Trash2 className="w-4 h-4" />}
              Delete
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading || deleting}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || deleting}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

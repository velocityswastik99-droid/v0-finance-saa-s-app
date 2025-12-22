import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  colorClass?: string
}

export function StatCard({ title, value, change, trend, icon: Icon, colorClass }: StatCardProps) {
  return (
    <Card className={cn("p-6 border-0 shadow-sm bg-gradient-to-br to-transparent", colorClass)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trend === "up" ? "text-success" : "text-destructive",
        )}
      >
        {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {change}
      </div>
    </Card>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-primary text-white",
        variant === "secondary" && "bg-gray-100 text-gray-700",
        variant === "outline" && "border border-gray-200 text-gray-700",
        variant === "destructive" && "bg-red-100 text-red-700",
        variant === "success" && "bg-green-100 text-green-700",
        className
      )}
      {...props}
    />
  )
}
export { Badge }

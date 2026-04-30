import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variant === "default" && "bg-primary text-white hover:bg-primary/90 shadow-sm",
          variant === "outline" && "border border-input bg-white hover:bg-gray-50",
          variant === "ghost" && "hover:bg-gray-100",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          size === "default" && "h-11 px-4 py-2",
          size === "sm" && "h-9 px-3 text-xs",
          size === "lg" && "h-12 px-6 text-base",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button }

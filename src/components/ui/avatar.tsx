import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div ref={ref} className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      size === "sm" && "h-8 w-8",
      size === "md" && "h-10 w-10",
      size === "lg" && "h-16 w-16",
      className
    )} {...props} />
  )
)
Avatar.displayName = "Avatar"

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium", className)} {...props} />
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarFallback }

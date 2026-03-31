import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[2rem] border px-6 py-4 text-sm [&>svg+div]:translate-y-[-1px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-5 [&>svg]:size-5 [&>svg~*]:pl-9 transition-all duration-300",
  {
    variants: {
      variant: {
        // Soft cream/stone background with a hint of forest green border
        default: "bg-[hsl(var(--secondary)/0.3)] text-[hsl(var(--foreground))] border-[hsl(var(--primary)/0.1)]",
        // Softened clay/terracotta tones for destructive states
        destructive:
          "bg-[hsl(var(--destructive)/0.05)] border-[hsl(var(--destructive)/0.2)] text-[hsl(var(--destructive))] [&>svg]:text-[hsl(var(--destructive))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight text-base", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed font-medium", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
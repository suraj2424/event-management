import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] font-bold tracking-tight transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Organic Forest: Uses a slight lift and a solid organic primary color
        default:
          "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:translate-y-[-1px] hover:shadow-md",
        // Soft Sand/Stone: A subtle background for secondary information
        secondary:
          "border-transparent bg-[hsl(var(--secondary)/0.6)] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]",
        // Earthy Clay: A softer, more natural take on destructive/danger states
        destructive:
          "border-transparent bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.2)] hover:bg-[hsl(var(--destructive)/0.2)]",
        // Minimal Outline: Very light and airy
        outline: 
          "text-[hsl(var(--foreground))] border-[hsl(var(--primary)/0.2)] bg-transparent hover:bg-[hsl(var(--primary)/0.05)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
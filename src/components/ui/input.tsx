import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.25rem] border-2 border-transparent bg-[hsl(var(--secondary)/0.4)] px-5 py-2 text-sm font-medium transition-all duration-300 placeholder:text-[hsl(var(--muted-foreground)/0.6)] focus-visible:bg-[hsl(var(--card))] focus-visible:border-[hsl(var(--primary)/0.2)] focus-visible:outline-none focus-visible:ring-[6px] focus-visible:ring-[hsl(var(--primary)/0.04)] disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-[hsl(var(--primary))] shadow-inner-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
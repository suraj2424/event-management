import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-[1.5rem] border-2 border-transparent bg-[hsl(var(--secondary)/0.4)] px-5 py-4 text-sm font-medium leading-relaxed transition-all duration-300 placeholder:text-[hsl(var(--muted-foreground)/0.6)] focus-visible:bg-[hsl(var(--card))] focus-visible:border-[hsl(var(--primary)/0.2)] focus-visible:outline-none focus-visible:ring-[6px] focus-visible:ring-[hsl(var(--primary)/0.04)] disabled:cursor-not-allowed disabled:opacity-50 shadow-inner-sm resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
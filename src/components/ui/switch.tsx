"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--primary)/0.1)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[hsl(var(--primary))] data-[state=unchecked]:bg-[hsl(var(--secondary)/0.6)] shadow-inner-sm",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-[hsl(var(--background))] shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        "group-active:data-[state=checked]:translate-x-4 group-active:data-[state=unchecked]:w-7" // Subtle "stretch" logic if wrapped in a group
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
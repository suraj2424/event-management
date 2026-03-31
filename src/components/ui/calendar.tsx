"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "@radix-ui/react-icons"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showTimePicker?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showTimePicker = false,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-4 bg-[hsl(var(--card))] rounded-[2rem] border border-[hsl(var(--border)/0.5)] shadow-xl shadow-black/5", className)}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className="p-0"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center mb-2",
          caption_label: "text-sm font-bold tracking-tight text-[hsl(var(--foreground))]",
          nav: "space-x-1 flex items-center",
          nav_button: "h-8 w-8 bg-[hsl(var(--secondary)/0.5)] hover:bg-[hsl(var(--secondary))] rounded-full flex items-center justify-center transition-all duration-300",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-[hsl(var(--muted-foreground))] rounded-full w-9 font-bold text-[0.7rem] uppercase tracking-widest",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full"
              : "[&:has([aria-selected])]:rounded-full"
          ),
          day: "h-9 w-9 p-0 font-medium rounded-full transition-all duration-300 hover:bg-[hsl(var(--primary)/0.1)] hover:text-[hsl(var(--primary))] aria-selected:opacity-100",
          day_range_start: "day-range-start aria-selected:bg-[hsl(var(--primary))] aria-selected:text-[hsl(var(--primary-foreground))]",
          day_range_end: "day-range-end aria-selected:bg-[hsl(var(--primary))] aria-selected:text-[hsl(var(--primary-foreground))]",
          day_selected:
            "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] focus:bg-[hsl(var(--primary))] focus:text-[hsl(var(--primary-foreground))] shadow-md shadow-[hsl(var(--primary)/0.2)] scale-110 z-10",
          day_today: "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-bold",
          day_outside: "day-outside text-[hsl(var(--muted-foreground))] opacity-30",
          day_disabled: "text-[hsl(var(--muted-foreground))] opacity-50",
          day_range_middle: "aria-selected:bg-[hsl(var(--secondary)/0.5)] aria-selected:text-[hsl(var(--foreground))] rounded-none",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-5 w-5" />,
          IconRight: ({ ...props }) => <ChevronRightIcon className="h-5 w-5" />,
        }}
        {...props}
      />

      {showTimePicker && (
        <div className="mt-4 pt-4 border-t border-[hsl(var(--border)/0.5)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <ClockIcon className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Time</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="23"
              className="w-12 h-9 rounded-xl bg-[hsl(var(--secondary)/0.5)] text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] transition-all"
              placeholder="12"
            />
            <span className="font-bold">:</span>
            <input
              type="number"
              min="0"
              max="59"
              className="w-12 h-9 rounded-xl bg-[hsl(var(--secondary)/0.5)] text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] transition-all"
              placeholder="00"
            />
          </div>
        </div>
      )}
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
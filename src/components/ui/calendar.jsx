import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0.5", className)}
      mode="single"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-0.5 sm:space-x-0.5 sm:space-y-0",
        month: "space-y-0.5",
        caption: "flex justify-center pt-0.5 relative items-center text-[0.65rem] sm:text-xs",
        caption_label: "text-[0.65rem] sm:text-xs font-medium",
        nav: "space-x-0.5 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-4 w-4 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-0.5",
        nav_button_next: "absolute right-0.5",
        table: "w-full border-collapse space-y-0.5",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-5 font-normal text-[0.6rem] sm:text-[0.7rem]",
        row: "flex w-full mt-0.5",
        cell: "h-5 w-5 text-center text-[0.65rem] sm:text-xs p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-5 w-5 p-0 font-normal aria-selected:opacity-100 text-[0.65rem] sm:text-xs"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-3 w-3" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-3 w-3" />,
      }}
      {...props}
    />
  )
}

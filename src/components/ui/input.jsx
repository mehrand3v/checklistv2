import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-slate-900 dark:file:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 selection:bg-blue-500 selection:text-white dark:selection:bg-blue-400 dark:selection:text-white",
        "flex h-10 w-full min-w-0 rounded-md border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-base shadow-sm transition-all duration-200",
        "outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-blue-500 dark:focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-400/20",
        "hover:border-slate-300 dark:hover:border-slate-600",
        "aria-invalid:border-red-500 dark:aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/20",
        className
      )}
      {...props} />
  );
}

export { Input }

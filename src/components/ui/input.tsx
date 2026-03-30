import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1 text-base text-white transition-all outline-none placeholder:text-white/40 focus-visible:border-white/50 focus-visible:ring-3 focus-visible:ring-white/20 focus-visible:bg-white/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white/5 disabled:opacity-50 aria-invalid:border-red-400/60 aria-invalid:ring-3 aria-invalid:ring-red-400/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }

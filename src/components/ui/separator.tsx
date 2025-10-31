import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    variant?: "default" | "dashed" | "dotted"
  }
>(
  (
    { className, orientation = "horizontal", decorative = true, variant = "default", ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        variant === "default" && "bg-gray-900",
        variant === "dashed" && "border-gray-900",
        variant === "dotted" && "border-gray-900",
        orientation === "horizontal" 
          ? variant === "default" 
            ? "h-[2px] w-full" 
            : variant === "dashed"
            ? "h-0 w-full border-t-2 border-dashed"
            : "h-0 w-full border-t-2 border-dotted"
          : variant === "default"
          ? "h-full w-[2px]"
          : variant === "dashed"
          ? "h-full w-0 border-l-2 border-dashed"
          : "h-full w-0 border-l-2 border-dotted",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

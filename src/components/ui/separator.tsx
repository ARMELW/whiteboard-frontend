import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const variantClasses = {
  horizontal: {
    default: "h-[2px] w-full bg-gray-900",
    dashed: "h-0 w-full border-t-2 border-dashed border-gray-900",
    dotted: "h-0 w-full border-t-2 border-dotted border-gray-900",
  },
  vertical: {
    default: "h-full w-[2px] bg-gray-900",
    dashed: "h-full w-0 border-l-2 border-dashed border-gray-900",
    dotted: "h-full w-0 border-l-2 border-dotted border-gray-900",
  },
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    variant?: "default" | "dashed" | "dotted"
  }
>(
  (
    { className, orientation = "horizontal", decorative = true, variant = "default", ...props },
    ref
  ) => {
    const variantClass = variantClasses[orientation][variant]
    
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn("shrink-0", variantClass, className)}
        {...props}
      />
    )
  }
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

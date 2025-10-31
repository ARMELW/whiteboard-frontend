import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "border-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600",
        secondary:
          "border-gray-900 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 hover:from-blue-200 hover:to-purple-200",
        destructive:
          "border-gray-900 bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600",
        outline: "border-gray-900 bg-white text-gray-900 hover:bg-amber-50",
        success:
          "border-gray-900 bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600",
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

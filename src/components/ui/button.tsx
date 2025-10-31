import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-gray-900 hover:from-amber-600 hover:to-orange-700 hover:scale-105 hover:-translate-y-0.5 shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,0.15)]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white border-gray-900 hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]",
        outline:
          "border-gray-900 bg-white hover:bg-amber-50 hover:border-amber-500 hover:scale-102 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.15)]",
        secondary:
          "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 border-gray-900 hover:from-blue-200 hover:to-purple-200 hover:scale-102 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.15)]",
        ghost: "border-transparent hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200",
        link: "text-amber-600 underline-offset-4 hover:underline border-transparent hover:text-amber-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

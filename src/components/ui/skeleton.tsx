import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] border-2 border-gray-900/10 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]",
        "animate-[pulse_2s_ease-in-out_infinite,shimmer_2s_linear_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] border-2 border-gray-900/10 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]",
        "animate-[pulse_2s_ease-in-out_infinite,shimmer_2s_linear_infinite]",
        className
      )}
      style={{
        backgroundSize: "200% 100%",
        animation: "pulse 2s ease-in-out infinite, shimmer 2s linear infinite",
      }}
      {...props}
    />
  )
}

export { Skeleton }

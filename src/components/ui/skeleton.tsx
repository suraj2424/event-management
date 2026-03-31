import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-organic-breathe rounded-[1.25rem] bg-[hsl(var(--primary)/0.08)] shadow-inner",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

/**
 * Add these to your tailwind.config.js or a global CSS file:
 * * @keyframes organic-breathe {
 * 0%, 100% { opacity: 0.4; transform: scale(1); }
 * 50% { opacity: 0.8; transform: scale(1.01); }
 * }
 * .animate-organic-breathe {
 * animation: organic-breathe 2.5s ease-in-out infinite;
 * }
 */
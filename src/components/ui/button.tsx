import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md hover:shadow-xl hover:shadow-[hsl(var(--primary)/0.15)]",
        destructive: "bg-[hsl(var(--destructive))] text-white",
        outline: "border-2 border-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] bg-transparent",
        secondary: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]",
        ghost: "text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.05)]",
        link: "text-[hsl(var(--primary))] hover:scale-105",
      },
      size: {
        default: "h-10 px-8",
        sm: "h-8 px-5 text-xs",
        lg: "h-13 px-12 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type BentoVariant = VariantProps<typeof buttonVariants>['variant'];
type BentoSize = VariantProps<typeof buttonVariants>['size'];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BentoVariant;
  size?: BentoSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

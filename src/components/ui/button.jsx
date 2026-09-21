import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 shadow-emerald-600/20',
        destructive:
          'bg-rose-600 text-white shadow-sm hover:bg-rose-500 shadow-rose-600/20',
        outline:
          'border border-slate-200 bg-white/70 backdrop-blur-md hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs',
        secondary:
          'bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 backdrop-blur-sm',
        ghost:
          'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900',
        link: 'text-emerald-600 underline-offset-4 hover:underline',
        glass:
          'bg-white/60 hover:bg-white/90 text-slate-800 border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-xl hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-xl px-5 text-sm',
        icon: 'h-8 w-8 rounded-lg p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };

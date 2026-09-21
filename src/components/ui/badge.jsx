import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
        secondary:
          'border border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80',
        destructive:
          'border border-rose-500/20 bg-rose-50 text-rose-700 hover:bg-rose-100/80',
        outline: 'text-slate-700 border border-slate-200',
        success:
          'border border-emerald-500/20 bg-emerald-50 text-emerald-800 backdrop-blur-sm',
        warning:
          'border border-amber-500/20 bg-amber-50 text-amber-800 backdrop-blur-sm',
        info:
          'border border-sky-500/20 bg-sky-50 text-sky-800 backdrop-blur-sm',
        glass:
          'border border-white/60 bg-white/70 text-slate-800 backdrop-blur-md shadow-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, glass = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border transition-all duration-300 relative overflow-hidden',
      glass
        ? 'bg-gradient-to-br from-white via-emerald-50/35 to-emerald-100/20 backdrop-blur-xl border-emerald-200/80 shadow-[0_8px_30px_rgb(16,185,129,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-emerald-900/[0.02] hover:shadow-[0_12px_36px_rgb(16,185,129,0.08)] hover:border-emerald-300/90'
        : 'bg-white border-emerald-200 shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-base font-bold leading-none tracking-tight text-slate-900',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-slate-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

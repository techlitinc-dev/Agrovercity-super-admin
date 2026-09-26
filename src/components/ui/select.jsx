import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, options = [], children, ...props }, ref) => {
  return (
    <div className="relative inline-block w-full">
      <select
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-xl border border-emerald-200/90 bg-white/95 px-3.5 py-1.5 pr-9 text-xs font-semibold text-slate-800 shadow-2xs backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
          className
        )}
        {...props}
      >
        {options.length > 0
          ? options.map((o) => (
              <option key={o.value} value={o.value} className="bg-white text-slate-900 font-medium">
                {o.label}
              </option>
            ))
          : children}
      </select>
    </div>
  );
});
Select.displayName = 'Select';

export { Select };

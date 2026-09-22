import * as React from 'react';
import { cn } from '@/lib/utils';

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [selected, setSelected] = React.useState(value || defaultValue);
  const currentVal = value !== undefined ? value : selected;

  const handleSelect = (v) => {
    setSelected(v);
    if (onValueChange) onValueChange(v);
  };

  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          activeValue: currentVal,
          onSelect: handleSelect,
        });
      })}
    </div>
  );
}

export function TabsList({ className, activeValue, onSelect, children }) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl bg-emerald-50/70 p-1 text-emerald-800 backdrop-blur-md border border-emerald-200/80 shadow-2xs',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          isActive: child.props.value === activeValue,
          onSelect,
        });
      })}
    </div>
  );
}

export function TabsTrigger({ value, isActive, onSelect, className, children }) {
  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-emerald-700 text-white shadow-xs font-bold'
          : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-white/60',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeValue, className, children }) {
  if (value !== activeValue) return null;
  return (
    <div className={cn('mt-4 ring-offset-background focus-visible:outline-none', className)}>
      {children}
    </div>
  );
}

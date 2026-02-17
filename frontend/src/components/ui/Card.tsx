import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = ({ className, children, noPadding = false, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div className={cn(noPadding ? "" : "p-6")}>
        {children}
      </div>
    </div>
  );
};

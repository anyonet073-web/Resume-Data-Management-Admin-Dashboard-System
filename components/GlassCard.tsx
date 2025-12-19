
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`glass rounded-sm p-8 ${className}`}>
      {title && (
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-[2px] bg-white"></div>
          <h3 className="mono text-sm font-bold uppercase tracking-[0.2em] text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

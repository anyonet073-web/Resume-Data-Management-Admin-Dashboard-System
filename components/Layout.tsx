
import React, { useMemo } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 0.5}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              //@ts-ignore
              '--duration': star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div className="grid-overlay"></div>
      
      <nav className="relative z-50 border-b border-white/5 py-5 px-8 flex justify-between items-center bg-black/60 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white"></div>
          <span className="mono font-black tracking-tighter text-xl uppercase">Resume Hub</span>
        </div>
        <div className="text-[10px] mono text-white/40 tracking-[0.2em] uppercase hidden md:block">
          Talent Gateway India
        </div>
      </nav>
      
      <main className="relative z-10 container mx-auto px-6 py-12 flex-1">
        {children}
      </main>
      
      <footer className="relative z-10 border-t border-white/5 py-8 px-8 text-center text-[10px] mono text-white/20 uppercase tracking-[0.3em]">
        &copy; 2025 Resume Hub Systems. Secure Bharat Tech Node.
      </footer>
    </div>
  );
};

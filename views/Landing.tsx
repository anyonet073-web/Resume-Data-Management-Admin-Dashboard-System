
import React from 'react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto animate-fadeIn relative z-10">
      <div className="mb-8 inline-block px-5 py-2 border border-white/10 rounded-full text-xs mono text-white/40 uppercase tracking-[0.5em]">
        Bharat Talent Hub
      </div>
      <h1 className="text-8xl md:text-9xl font-black mb-8 tracking-tighter uppercase leading-none text-white">
        RESUME HUB
      </h1>
      <p className="text-xl text-white/30 mb-20 leading-relaxed max-w-xl font-light">
        A premium gateway for India's technical elite. Securely manage, verify, and match professional identities.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-4">
        <button 
          onClick={onGetStarted}
          className="btn-primary py-10 rounded-sm font-black uppercase tracking-widest text-sm flex flex-col items-center gap-3 group border border-white/10"
        >
          <span className="text-[10px] opacity-40 font-bold mono">Candidate Portal</span>
          <span className="text-lg">User Login</span>
        </button>
        <button 
          onClick={onGetStarted}
          className="btn-secondary py-10 rounded-sm font-black uppercase tracking-widest text-sm flex flex-col items-center gap-3 group hover:bg-white hover:text-black transition-all"
        >
          <span className="text-[10px] opacity-30 font-bold mono">System Core</span>
          <span className="text-lg">Admin Login</span>
        </button>
      </div>
    </div>
  );
};

export default Landing;

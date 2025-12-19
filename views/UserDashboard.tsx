
import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { User, CandidateStatus } from '../types';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Profile Console</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-12 h-1 bg-white"></div>
            <p className="mono text-[10px] text-white/40 uppercase tracking-widest">Personal Candidate Node</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn-secondary px-6 py-2 text-[10px] font-black uppercase tracking-widest">Disconnect</button>
      </header>

      {!user.isVerified && (
        <div className="border border-white/20 p-6 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
             <p className="mono text-[10px] uppercase tracking-widest text-white/60">Authorization required. check your identity link.</p>
          </div>
          <button className="mono text-[10px] font-bold uppercase underline">Resend Dispatched Link</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <div className="md:col-span-2">
          <GlassCard title="Identity Record">
            <div className="space-y-10">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-white flex items-center justify-center text-black text-5xl font-black">
                  {user.name[0]}
                </div>
                <div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter">{user.name}</h3>
                  <div className="mono text-[10px] text-white/40 uppercase tracking-widest mt-1">{user.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-10 border-t border-white/5">
                <div>
                  <label className="mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-3 block">Primary Domain</label>
                  <div className="text-xl font-black uppercase">{user.domain}</div>
                </div>
                <div>
                  <label className="mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-3 block">Exp Lifecycle</label>
                  <div className="text-xl font-black uppercase">{user.experience} Years</div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <label className="mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4 block">Competency Array</label>
                <div className="flex flex-wrap gap-3">
                  {user.skill.split(',').map((s, i) => (
                    <span key={i} className="px-4 py-2 border border-white/10 mono text-[10px] uppercase font-bold hover:border-white transition-all cursor-default">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-1">
          <div className="bg-black border border-white/10 p-8 flex-1">
            <div className="mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-8">System Status</div>
            <div className={`text-4xl font-black uppercase tracking-tighter mb-4 ${
              user.status === CandidateStatus.APPROVED ? 'text-[#00ffcc]' :
              user.status === CandidateStatus.REJECTED ? 'text-red-500' :
              'text-white/40'
            }`}>
              {user.status}
            </div>
            {user.status === CandidateStatus.PENDING && (
              <div className="h-[1px] w-full bg-white/5 relative overflow-hidden mt-8">
                <div className="absolute inset-0 bg-white w-1/4 animate-[move_2s_linear_infinite]"></div>
              </div>
            )}
          </div>

          <div className="bg-black border border-white/10 p-8 flex-1">
            <div className="mono text-[10px] text-white/30 uppercase tracking-[0.3em] mb-8">Directives</div>
            <ul className="space-y-6 mono text-[10px] uppercase tracking-widest">
              <li className={`flex gap-3 ${user.isVerified ? 'opacity-20 line-through' : ''}`}>
                <span className="text-[#00ffcc]">01</span> Identity Auth
              </li>
              <li className="flex gap-3">
                <span className="text-[#00ffcc]">02</span> Documentation Upload
              </li>
              <li className="flex gap-3">
                <span className="text-[#00ffcc]">03</span> Neural Core Scan
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;

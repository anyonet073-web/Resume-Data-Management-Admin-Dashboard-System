
import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from '../components/GlassCard';
import { dbService } from '../services/dbService';
import { analyzeCandidate, correlateCandidates } from '../services/geminiService';
import { User, CandidateStatus, CoreDomain } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CandidateStatus>('all');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<{ id: string, text: string } | null>(null);
  
  const [projectReq, setProjectReq] = useState('');
  const [isCorrelating, setIsCorrelating] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);

  useEffect(() => {
    // Load data directly from shared dbService
    const loadData = () => {
      setUsers(dbService.getUsers());
    };
    loadData();
    // Refresh if window gains focus to sync state
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  const handleCorrelatedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectReq) return;
    setIsCorrelating(true);
    const results = await correlateCandidates(projectReq, users);
    setMatchResults(results);
    setIsCorrelating(false);
  };

  const filteredUsers = useMemo(() => {
    const candidatesOnly = users.filter(u => u.id !== 'admin-root');
    let base = candidatesOnly.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.skill.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (matchResults.length > 0) {
      return base.map(u => ({
        ...u,
        aiMatch: matchResults.find(m => m.id === u.id)
      })).sort((a, b) => (b.aiMatch?.matchScore || 0) - (a.aiMatch?.matchScore || 0));
    }

    return base;
  }, [users, searchTerm, statusFilter, matchResults]);

  const stats = useMemo(() => {
    const candidates = users.filter(u => u.id !== 'admin-root');
    return {
      total: candidates.length,
      approved: candidates.filter(u => u.status === CandidateStatus.APPROVED).length,
      pending: candidates.filter(u => u.status === CandidateStatus.PENDING).length
    };
  }, [users]);

  const skillData = useMemo(() => {
    const counts: Record<string, number> = {};
    const candidates = users.filter(u => u.id !== 'admin-root');
    candidates.forEach(u => counts[u.domain] = (counts[u.domain] || 0) + 1);
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [users]);

  const COLORS = ['#ffffff', '#00ffcc', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-12 animate-fadeIn max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-7xl font-black uppercase tracking-tighter text-white">ADMIN CORE</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-20 h-2 bg-white"></div>
            <p className="mono text-sm text-white/40 uppercase tracking-[0.3em]">Master Talent Registry Interface</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn-secondary px-10 py-4 text-xs font-black uppercase tracking-widest border-white/20 hover:bg-white hover:text-black transition-all">Disconnect</button>
      </header>

      {/* Real-time Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 shadow-2xl">
        {[
          { label: "Total Registered Candidates", value: stats.total },
          { label: "Vetted Identities", value: stats.approved },
          { label: "Awaiting Verification", value: stats.pending }
        ].map((stat, i) => (
          <div key={i} className="bg-black p-12 hover:bg-white/[0.02] transition-colors">
            <div className="text-[10px] mono text-white/30 uppercase mb-4 tracking-[0.4em] font-bold">{stat.label}</div>
            <div className="text-6xl font-black text-white tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 border-white/5" title="Neural Requirement Matcher">
          <form onSubmit={handleCorrelatedSearch} className="space-y-8">
            <textarea 
              value={projectReq}
              onChange={(e) => setProjectReq(e.target.value)}
              placeholder="Describe requirement... e.g. 'Senior Java developer with 5 years exp based in Bangalore'"
              className="w-full h-44 p-6 text-white resize-none text-xl font-light leading-relaxed border-white/10"
            />
            <button 
              type="submit" 
              disabled={isCorrelating}
              className="btn-primary px-12 py-5 font-black uppercase tracking-widest text-xs"
            >
              {isCorrelating ? 'Scanning Network...' : 'Execute Correlation Scan'}
            </button>
          </form>
        </GlassCard>

        <GlassCard title="Talent Distribution" className="border-white/5">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={skillData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value">
                  {skillData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '0', fontFamily: 'JetBrains Mono' }} />
                <Legend iconType="square" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', paddingTop: '30px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Active Talent Registry" className="border-white/5">
        <div className="mb-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="flex-1 w-full space-y-3">
            <label className="mono text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">Search Filter</label>
            <input 
              type="text" 
              placeholder="Enter name or technical vector..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xl p-5 text-lg font-light border-white/10"
            />
          </div>
          {matchResults.length > 0 && (
            <button onClick={() => { setMatchResults([]); setProjectReq(''); }} className="mono text-xs text-red-500 font-black uppercase tracking-widest hover:underline decoration-red-500/50">Reset Matching Protocol</button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 mono text-xs text-white/30 uppercase tracking-[0.2em]">
                <th className="px-10 py-6 font-bold">Identity</th>
                <th className="px-10 py-6 font-bold">Technical Matrix</th>
                <th className="px-10 py-6 font-bold">AI Scored Eligibility</th>
                <th className="px-10 py-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-white/[0.04] transition-all group">
                  <td className="px-10 py-10">
                    <div className="font-black text-2xl mb-2 group-hover:text-white transition-colors">{u.name}</div>
                    <div className="text-xs mono text-white/40 uppercase tracking-tight">{u.email}</div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="mono text-xs font-black text-white uppercase tracking-widest border border-white/20 px-4 py-2 bg-white/5">{u.domain}</span>
                      <span className="mono text-[11px] text-[#00ffcc] uppercase font-black">{u.experience}Y Experience</span>
                    </div>
                    <div className="text-sm text-white/40 font-medium max-w-xs leading-relaxed">{u.skill}</div>
                  </td>
                  <td className="px-10 py-10">
                    {u.aiMatch ? (
                      <div className="animate-fadeIn w-56">
                        <div className="flex items-center justify-between gap-6 mb-4">
                           <div className="text-3xl font-black text-[#00ffcc] tracking-tighter">{u.aiMatch.matchScore}%</div>
                           <div className="h-2 flex-1 bg-white/10">
                             <div className="h-full bg-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.5)]" style={{ width: `${u.aiMatch.matchScore}%` }}></div>
                           </div>
                        </div>
                        <div className="text-[10px] mono text-white/30 leading-relaxed uppercase tracking-tighter italic">{u.aiMatch.reason}</div>
                      </div>
                    ) : (
                      <span className="mono text-xs text-white/10 uppercase font-black tracking-[0.2em]">Scanner Pending</span>
                    )}
                  </td>
                  <td className="px-10 py-10 text-right">
                    <button onClick={async () => {
                      setAnalyzingId(u.id);
                      const insight = await analyzeCandidate(u);
                      setAiInsight({ id: u.id, text: insight });
                      setAnalyzingId(null);
                    }} className="mono text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-all underline decoration-1 underline-offset-8">
                      {analyzingId === u.id ? 'Accessing...' : 'Deep Profile Scan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-32 text-center text-white/10 font-black uppercase tracking-[0.6em]">Zero Frequency Match Detected</div>
          )}
        </div>
      </GlassCard>

      {aiInsight && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-10 z-[100]">
          <div className="max-w-3xl w-full bg-black border border-white/20 p-20 relative shadow-[0_0_100px_rgba(255,255,255,0.05)]">
            <button onClick={() => setAiInsight(null)} className="absolute top-12 right-12 text-white/20 hover:text-white text-5xl font-light transition-all">&times;</button>
            <div className="flex items-center gap-5 mb-16">
              <div className="h-8 w-2 bg-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.8)]"></div>
              <h3 className="mono text-base font-black uppercase tracking-[0.5em] text-[#00ffcc]">AI Neural Insight Dispatch</h3>
            </div>
            <p className="text-3xl text-white font-light leading-snug mb-20 italic">"{aiInsight.text}"</p>
            <button onClick={() => setAiInsight(null)} className="btn-primary w-full py-6 text-sm font-black uppercase tracking-[0.5em]">Close Record</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

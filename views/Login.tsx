
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { UserRole, User, CoreDomain } from '../types';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';

interface LoginProps {
  onLogin: (role: UserRole, user: User | null) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState<CoreDomain>(CoreDomain.DEVELOPER);
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<{ email: string, token: string } | null>(null);
  const [resetToken, setResetToken] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result) {
        localStorage.setItem('nexus_token', result.token);
        onLogin(result.user.role, result.user);
      } else {
        setError('UNAUTHORIZED: ACCESS DENIED');
      }
    } catch {
      setError('SYSTEM ERROR: AUTH SERVICE FAILURE');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const newUser = await authService.register({ name, email, password, domain, skill, experience });
      setVerificationData({ email: newUser.email, token: newUser.verificationToken! });
      setMode('login');
    } catch {
      setError('FAILED TO INITIALIZE IDENTITY');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = authService.forgotPassword(email);
    if (token) {
      setResetToken(token);
      setMode('reset');
    } else {
      setError('IDENTITY NOT DETECTED');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authService.resetPassword(resetToken, password);
    if (success) {
      alert('Security keys updated.');
      setMode('login');
    } else {
      setError('INVALID RESET PROTOCOL');
    }
  };

  if (verificationData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
        <GlassCard className="w-full max-w-md text-center border-white/10 p-16">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Identity Proof</h2>
          <p className="text-white/40 mb-12 text-lg leading-relaxed">
            Activation link sent to: <br/>
            <span className="text-white font-bold">{verificationData.email}</span>
          </p>
          <button 
            onClick={() => { dbService.verifyUserByToken(verificationData.token); setVerificationData(null); }} 
            className="w-full py-6 btn-primary font-black uppercase tracking-widest text-xs mb-6"
          >
            Verify Simulation
          </button>
          <button onClick={() => setVerificationData(null)} className="mono text-xs text-white/20 uppercase hover:text-white transition-all">Cancel</button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
      <GlassCard className={`w-full ${mode === 'register' ? 'max-w-3xl' : 'max-w-lg'} p-16 border-white/5`}>
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset'}
          </h2>
          <div className="h-2 w-20 bg-white mx-auto md:mx-0"></div>
        </div>
        
        <form onSubmit={
          mode === 'login' ? handleLoginSubmit : 
          mode === 'register' ? handleRegisterSubmit : 
          mode === 'forgot' ? handleForgotSubmit : 
          handleResetSubmit
        } className="space-y-12">
          
          {mode === 'register' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
              <div className="space-y-4">
                <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-5 text-white text-xl font-light" placeholder="Arjun Mehta" />
              </div>
              <div className="space-y-4">
                <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Email ID</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-5 text-white text-xl font-light" placeholder="name@domain.com" />
              </div>
              <div className="space-y-4">
                <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-5 text-white text-xl font-light" placeholder="••••••••" />
              </div>
              <div className="space-y-4">
                <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Core Domain</label>
                <select value={domain} onChange={(e) => setDomain(e.target.value as CoreDomain)} className="w-full p-5 text-white text-xl font-light cursor-pointer">
                  <option value={CoreDomain.DEVELOPER}>Developer</option>
                  <option value={CoreDomain.AI}>AI Engineering</option>
                  <option value={CoreDomain.HARDWARE}>Hardware</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Primary Skills</label>
                <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} required className="w-full p-5 text-white text-xl font-light" placeholder="React, Node, Java..." />
              </div>
              <div className="space-y-4">
                <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Experience (Yrs)</label>
                <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} required className="w-full p-5 text-white text-xl font-light" placeholder="e.g. 5" />
              </div>
            </div>
          )}

          {mode !== 'register' && (
            <div className="space-y-12">
              {(mode === 'login' || mode === 'forgot') && (
                <div className="space-y-4">
                  <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Email ID</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-6 text-white text-2xl font-light" placeholder="admin@123gmail.com" />
                </div>
              )}
              {(mode === 'login' || mode === 'reset') && (
                <div className="space-y-4">
                  <label className="mono text-sm text-white font-bold uppercase tracking-[0.3em] block">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-6 text-white text-2xl font-light" placeholder="••••••••" />
                </div>
              )}
            </div>
          )}

          {error && <p className="mono text-sm text-red-500 font-black border border-red-500/40 p-6 bg-red-500/5 text-center uppercase tracking-widest">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full py-8 btn-primary font-black uppercase tracking-[0.4em] text-sm hover:scale-[1.01] active:scale-100 transition-all shadow-2xl">
            {isLoading ? 'Processing...' : mode === 'login' ? 'Authorize Access' : mode === 'register' ? 'Register Now' : 'Submit'}
          </button>

          <div className="flex flex-col gap-8 text-center pt-12 border-t border-white/5">
            {mode === 'login' && (
              <>
                <button type="button" onClick={() => setMode('register')} className="group flex flex-col items-center gap-2">
                  <span className="mono text-xs text-white/30 uppercase tracking-[0.2em] group-hover:text-white/50 transition-all">No identity found?</span>
                  <span className="text-2xl font-black text-white hover:text-[#00ffcc] uppercase tracking-tighter transition-all">New User? Join Now</span>
                </button>
                <button type="button" onClick={() => setMode('forgot')} className="mono text-xs text-white/20 hover:text-white uppercase tracking-widest transition-all">Reset Access Key</button>
              </>
            )}
            {mode !== 'login' && (
              <button type="button" onClick={() => setMode('login')} className="mono text-sm text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all font-black">Return to Entry Point</button>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default Login;

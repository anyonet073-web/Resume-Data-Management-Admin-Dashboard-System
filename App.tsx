
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AuthState, UserRole, User } from './types';
import Landing from './views/Landing';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import UserDashboard from './views/UserDashboard';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    currentUser: null
  });

  // Secure session check on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('nexus_auth');
    const token = localStorage.getItem('nexus_token');
    
    if (savedAuth && token) {
      // Robust check: Verify token validity
      const payload = authService.verifyToken(token);
      if (payload) {
        setAuth(JSON.parse(savedAuth));
        setView('dashboard');
      } else {
        // Token expired or invalid
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (role: UserRole, user: User | null) => {
    const newAuth = { isLoggedIn: true, role, currentUser: user };
    setAuth(newAuth);
    localStorage.setItem('nexus_auth', JSON.stringify(newAuth));
    setView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setAuth({ isLoggedIn: false, role: null, currentUser: null });
    localStorage.removeItem('nexus_token');
    setView('landing');
  };

  const renderView = () => {
    if (view === 'landing') return <Landing onGetStarted={() => setView('login')} />;
    if (view === 'login') return <Login onLogin={handleLogin} onBack={() => setView('landing')} />;
    if (view === 'dashboard') {
      return auth.role === UserRole.ADMIN ? 
        <AdminDashboard onLogout={handleLogout} /> : 
        <UserDashboard user={auth.currentUser!} onLogout={handleLogout} />;
    }
    return <Landing onGetStarted={() => setView('login')} />;
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

export default App;

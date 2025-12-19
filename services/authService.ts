
import bcrypt from 'bcryptjs';
import { dbService } from './dbService';
import { User, UserRole, CandidateStatus } from '../types';

const AUTH_KEY = 'nexus_auth_session';

export const authService = {
  generateToken: (user: User): string => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }));
    const signature = btoa("nexus_secret_key");
    return `${header}.${payload}.${signature}`;
  },

  login: async (email: string, pass: string): Promise<{ user: User, token: string } | null> => {
    const users = dbService.getUsers();
    const user = users.find(u => u.email === email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const token = authService.generateToken(user);
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword as User, token };
      }
    }
    return null;
  },

  register: async (userData: Omit<User, 'id' | 'status' | 'role' | 'isVerified' | 'verificationToken'>): Promise<User> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password || '', salt);
    const verificationToken = Math.random().toString(36).substring(2, 15);
    const newUser = dbService.addUser({
      ...userData,
      password: hashedPassword,
      role: UserRole.CANDIDATE,
      isVerified: false,
      verificationToken
    });
    return newUser;
  },

  forgotPassword: (email: string): string | null => {
    const users = dbService.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      const resetToken = Math.random().toString(36).substring(2, 15);
      const expires = Date.now() + 3600000; // 1 hour
      const updated = users.map(u => u.email === email ? { ...u, resetPasswordToken: resetToken, resetPasswordExpires: expires } : u);
      localStorage.setItem('nexus_users_db', JSON.stringify(updated));
      return resetToken;
    }
    return null;
  },

  resetPassword: async (token: string, newPass: string): Promise<boolean> => {
    const users = dbService.getUsers();
    const user = users.find(u => u.resetPasswordToken === token && (u.resetPasswordExpires || 0) > Date.now());
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);
      const updated = users.map(u => u.id === user.id ? { 
        ...u, 
        password: hashedPassword, 
        resetPasswordToken: undefined, 
        resetPasswordExpires: undefined 
      } : u);
      localStorage.setItem('nexus_users_db', JSON.stringify(updated));
      return true;
    }
    return false;
  },

  verifyToken: (token: string): any | null => {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      if (payload.exp < Date.now() / 1000) return null;
      return payload;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('nexus_auth');
  }
};

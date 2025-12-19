
import { User, CandidateStatus } from '../types';
import { INITIAL_USERS } from '../constants';

const DB_KEY = 'nexus_users_db';

export const dbService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },

  updateUserStatus: (id: string, status: CandidateStatus): User[] => {
    const users = dbService.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, status } : u);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  },

  verifyUserByToken: (token: string): { success: boolean, user?: User } => {
    const users = dbService.getUsers();
    const userIndex = users.findIndex(u => u.verificationToken === token);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], isVerified: true, verificationToken: undefined };
      users[userIndex] = updatedUser;
      localStorage.setItem(DB_KEY, JSON.stringify(users));
      return { success: true, user: updatedUser };
    }
    return { success: false };
  },

  toggleVerification: (id: string): User[] => {
    const users = dbService.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, isVerified: !u.isVerified } : u);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteUser: (id: string): User[] => {
    const users = dbService.getUsers();
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  },

  addUser: (user: Omit<User, 'id' | 'status'>): User => {
    const users = dbService.getUsers();
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      status: CandidateStatus.PENDING
    };
    localStorage.setItem(DB_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  }
};

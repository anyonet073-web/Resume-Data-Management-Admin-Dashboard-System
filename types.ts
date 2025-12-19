
export enum UserRole {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE'
}

export enum CandidateStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum CoreDomain {
  AI = 'AI',
  DEVELOPER = 'Developer',
  HARDWARE = 'Hardware'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  domain: CoreDomain;
  skill: string;
  status: CandidateStatus;
  experience: string;
  summary?: string;
  isVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  currentUser: User | null;
  token?: string;
}

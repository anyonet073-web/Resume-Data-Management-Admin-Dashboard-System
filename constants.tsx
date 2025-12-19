
import { User, UserRole, CandidateStatus, CoreDomain } from './types';

export const INITIAL_USERS: User[] = [
  { 
    id: '1', 
    name: "Arjun Mehta", 
    email: "arjun@mumbai.tech", 
    password: "$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm", 
    domain: CoreDomain.DEVELOPER,
    skill: "Java, Spring Boot, Microservices, React", 
    status: CandidateStatus.APPROVED, 
    experience: "4 years", 
    role: UserRole.CANDIDATE, 
    isVerified: true 
  },
  { 
    id: '2', 
    name: "Priyanka Sharma", 
    email: "priyanka@bangalore.ai", 
    password: "$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm", 
    domain: CoreDomain.AI,
    skill: "Python, TensorFlow, NLP, LangChain", 
    status: CandidateStatus.PENDING, 
    experience: "2 years", 
    role: UserRole.CANDIDATE, 
    isVerified: true 
  },
  { 
    id: '3', 
    name: "Rohan Das", 
    email: "rohan@pune.dev", 
    password: "$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm", 
    domain: CoreDomain.DEVELOPER,
    skill: "Node.js, Express, MongoDB, Flutter", 
    status: CandidateStatus.APPROVED, 
    experience: "3 years", 
    role: UserRole.CANDIDATE, 
    isVerified: true 
  },
  { 
    id: 'admin-root', 
    name: "System Admin", 
    email: "admin@123gmail.com", 
    password: "$2a$10$EozD2p77fUvP1Z9B69.HaehE2OQ/N8YVvQn8YfF9u9i3N/T6Yv2Q6", // admin@123
    domain: CoreDomain.AI,
    skill: "Cloud Infrastructure, Scalability", 
    status: CandidateStatus.APPROVED, 
    experience: "12 years", 
    role: UserRole.ADMIN,
    isVerified: true
  }
];

export const ADMIN_CREDENTIALS = {
  email: "admin@123gmail.com",
  password: "admin@123"
};

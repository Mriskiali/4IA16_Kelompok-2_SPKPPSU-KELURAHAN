export enum Role {
  PETUGAS = 'PETUGAS',
  ADMIN = 'ADMIN'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum ReportCategory {
  KEBERSIHAN = 'KEBERSIHAN',
  KERUSAKAN = 'KERUSAKAN',
  TAMAN = 'TAMAN',
  SALURAN = 'SALURAN',
  LAINNYA = 'LAINNYA'
}

export interface User {
  id: string;
  pjlpNumber: string;
  name: string;
  role: Role;
  isActive: boolean;
  phone?: string;
  avatarUrl?: string;
  password?: string; // Added for auth simulation
}

export interface Report {
  id: string;
  userId: string;
  userName: string; // Denormalized for prototype ease
  category: ReportCategory;
  description: string;
  imageUrl: string;
  location: string;
  status: ReportStatus;
  createdAt: string; // ISO String
  feedback?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface Notification {
  id: string;
  userId: string; // The user who should receive this notification
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}
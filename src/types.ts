export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
  avatarColor: string;
}

export interface UserMemo {
  id: string;
  content: string;
  createdAt: string;
  isCompleted?: boolean;
}

export type AuthView = 'login' | 'register' | 'forgot_password';

export interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

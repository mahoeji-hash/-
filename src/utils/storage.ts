import { User, UserMemo } from '../types';

const USERS_STORAGE_KEY = 'simple_auth_app_users_v1';
const SESSION_STORAGE_KEY = 'simple_auth_app_session_v1';
const MEMOS_STORAGE_PREFIX = 'simple_auth_app_memos_v1_';

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export function getRandomAvatarColor(): string {
  const index = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[index];
}

// Initial demo user
const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: '홍길동 (체험용)',
    email: 'demo@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    avatarColor: 'bg-indigo-500',
  },
];

export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return parsed;
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function registerUser(name: string, email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, message: '이미 가입된 이메일 주소입니다.' };
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    createdAt: new Date().toISOString(),
    avatarColor: getRandomAvatarColor(),
  };

  users.push(newUser);
  saveUsers(users);

  // Seed default welcome memo for new user
  saveUserMemos(newUser.id, [
    {
      id: `memo-${Date.now()}-1`,
      content: `${newUser.name}님, 회원가입을 축하합니다! 🎉\n이곳은 로그인한 본인만 볼 수 있는 개인 메모 공간입니다.`,
      createdAt: new Date().toISOString(),
      isCompleted: false,
    },
  ]);

  return { success: true, message: '회원가입이 완료되었습니다.', user: newUser };
}

export function loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return { success: false, message: '가입되지 않은 이메일입니다.' };
  }

  if (user.password !== password) {
    return { success: false, message: '비밀번호가 올바르지 않습니다.' };
  }

  // Update lastLoginAt
  user.lastLoginAt = new Date().toISOString();
  saveUsers(users);
  setCurrentSession(user);

  return { success: true, message: '로그인에 성공했습니다.', user };
}

export function resetPassword(email: string, newPassword: string): { success: boolean; message: string } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (userIndex === -1) {
    return { success: false, message: '일치하는 계정을 찾을 수 없습니다.' };
  }

  users[userIndex].password = newPassword;
  saveUsers(users);
  return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
}

export function updateProfile(userId: string, newName: string): { success: boolean; message: string; updatedUser?: User } {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
  }

  user.name = newName.trim();
  saveUsers(users);
  setCurrentSession(user);
  return { success: true, message: '프로필 이름이 수정되었습니다.', updatedUser: user };
}

export function changeUserPassword(userId: string, currentPass: string, newPass: string): { success: boolean; message: string } {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
  }

  if (user.password !== currentPass) {
    return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
  }

  user.password = newPass;
  saveUsers(users);
  return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
}

export function getCurrentSession(): User | null {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    const sessionUser = JSON.parse(data) as User;
    // Verify user still exists in DB
    const users = getUsers();
    const existing = users.find((u) => u.id === sessionUser.id);
    return existing || null;
  } catch {
    return null;
  }
}

export function setCurrentSession(user: User): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// User-specific memos (to demonstrate distinct personalized data)
export function getUserMemos(userId: string): UserMemo[] {
  try {
    const key = `${MEMOS_STORAGE_PREFIX}${userId}`;
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveUserMemos(userId: string, memos: UserMemo[]): void {
  const key = `${MEMOS_STORAGE_PREFIX}${userId}`;
  localStorage.setItem(key, JSON.stringify(memos));
}

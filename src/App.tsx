import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User, AuthView, ToastInfo } from './types';
import {
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  loginUser,
  registerUser,
  resetPassword,
  updateProfile,
  changeUserPassword,
} from './utils/storage';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { Dashboard } from './components/Dashboard';
import { ProfileModal } from './components/ProfileModal';
import { ToastContainer } from './components/Toast';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize session on load
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser(session);
    }
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogin = (email: string, pass: string) => {
    setLoading(true);
    setTimeout(() => {
      const res = loginUser(email, pass);
      setLoading(false);
      if (res.success && res.user) {
        setUser(res.user);
        addToast('success', `${res.user.name}님, 환영합니다!`);
      } else {
        addToast('error', res.message);
      }
    }, 350);
  };

  const handleRegister = (name: string, email: string, pass: string) => {
    setLoading(true);
    setTimeout(() => {
      const res = registerUser(name, email, pass);
      setLoading(false);
      if (res.success && res.user) {
        setCurrentSession(res.user);
        setUser(res.user);
        addToast('success', '회원가입이 성공적으로 완료되었습니다!');
      } else {
        addToast('error', res.message);
      }
    }, 350);
  };

  const handleResetPassword = (email: string, newPass: string) => {
    setLoading(true);
    setTimeout(() => {
      const res = resetPassword(email, newPass);
      setLoading(false);
      if (res.success) {
        addToast('success', '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.');
        setAuthView('login');
      } else {
        addToast('error', res.message);
      }
    }, 350);
  };

  const handleLogout = () => {
    clearCurrentSession();
    setUser(null);
    setAuthView('login');
    addToast('info', '안전하게 로그아웃되었습니다.');
  };

  const handleUpdateName = (newName: string) => {
    if (!user) return;
    const res = updateProfile(user.id, newName);
    if (res.success && res.updatedUser) {
      setUser(res.updatedUser);
      setIsProfileOpen(false);
      addToast('success', res.message);
    } else {
      addToast('error', res.message);
    }
  };

  const handleChangePassword = (currentPass: string, newPass: string) => {
    if (!user) return;
    const res = changeUserPassword(user.id, currentPass, newPass);
    if (res.success) {
      setIsProfileOpen(false);
      addToast('success', res.message);
    } else {
      addToast('error', res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Content Area */}
      {user ? (
        <main className="flex-1 flex flex-col">
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onOpenProfile={() => setIsProfileOpen(true)}
            onSwitchUser={(newUser) => setUser(newUser)}
            onShowToast={addToast}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          {/* Logo & Brand Header */}
          <div className="mb-6 flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">간편 인증 포털</span>
          </div>

          {/* Auth Card */}
          <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200/80">
            <AnimatePresence mode="wait">
              {authView === 'login' && (
                <LoginForm
                  key="login"
                  onLogin={handleLogin}
                  onNavigate={setAuthView}
                  loading={loading}
                />
              )}
              {authView === 'register' && (
                <RegisterForm
                  key="register"
                  onRegister={handleRegister}
                  onNavigate={setAuthView}
                  loading={loading}
                />
              )}
              {authView === 'forgot_password' && (
                <ForgotPasswordModal
                  key="forgot"
                  onReset={handleResetPassword}
                  onNavigate={setAuthView}
                  loading={loading}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Quick Help Tip */}
          <div className="mt-6 text-center text-xs text-slate-400 max-w-xs flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>회원가입 후 즉시 로그인하여 개인 메모장을 사용할 수 있습니다.</span>
          </div>
        </main>
      )}

      {/* Profile Edit Modal */}
      {user && (
        <ProfileModal
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onUpdateName={handleUpdateName}
          onChangePassword={handleChangePassword}
        />
      )}
    </div>
  );
}

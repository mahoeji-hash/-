import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { AuthView } from '../types';

interface LoginFormProps {
  onLogin: (email: string, pass: string) => void;
  onNavigate: (view: AuthView) => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onNavigate, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    onLogin(email, password);
  };

  const handleFillDemo = () => {
    setEmail('demo@example.com');
    setPassword('password123');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-xs">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">로그인</h1>
        <p className="text-sm text-slate-500 mt-1.5">
          계정에 로그인하여 나만의 공간을 이용해보세요.
        </p>
      </div>

      {/* Demo Account Quick Button */}
      <button
        type="button"
        id="btn-fill-demo-account"
        onClick={handleFillDemo}
        className="w-full mb-6 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 text-xs flex items-center justify-between transition-all group cursor-pointer"
      >
        <span className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <span>테스트용 계정 정보 1초 만에 자동 입력</span>
        </span>
        <span className="text-blue-600 font-semibold group-hover:underline">입력하기</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            이메일 주소
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
              비밀번호
            </label>
            <button
              type="button"
              id="btn-goto-forgot-password"
              onClick={() => onNavigate('forgot_password')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              id="btn-toggle-login-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? '비밀번호 가리기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me option */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              id="checkbox-remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>로그인 상태 유지</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-login-submit"
          disabled={loading || !email.trim() || !password}
          className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>로그인하기</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          아직 계정이 없으신가요?{' '}
          <button
            type="button"
            id="btn-goto-register"
            onClick={() => onNavigate('register')}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer ml-1"
          >
            간편 회원가입
          </button>
        </p>
      </div>
    </motion.div>
  );
};

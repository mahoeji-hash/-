import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { AuthView } from '../types';

interface RegisterFormProps {
  onRegister: (name: string, email: string, pass: string) => void;
  onNavigate: (view: AuthView) => void;
  loading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onNavigate, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 1) return { level: 1, text: '취약', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { level: 2, text: '보통', color: 'bg-amber-500' };
    return { level: 3, text: '안전', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    if (password !== confirmPassword) return;
    if (!agreedTerms) return;
    onRegister(name, email, password);
  };

  const isFormValid =
    name.trim().length >= 2 &&
    email.includes('@') &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreedTerms;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 shadow-xs">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">회원가입</h1>
        <p className="text-sm text-slate-500 mt-1.5">
          간단한 정보만 입력하면 바로 시작할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name Input */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
            이름 / 닉네임
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            이메일 주소
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
            비밀번호 <span className="text-slate-400 font-normal">(6자 이상)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <button
              type="button"
              id="btn-toggle-reg-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? '비밀번호 가리기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength meter */}
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 rounded-full ${strength.level >= 1 ? strength.color : 'bg-slate-200'}`} />
                <div className={`h-full flex-1 rounded-full ${strength.level >= 2 ? strength.color : 'bg-slate-200'}`} />
                <div className={`h-full flex-1 rounded-full ${strength.level >= 3 ? strength.color : 'bg-slate-200'}`} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">{strength.text}</span>
            </div>
          )}
        </div>

        {/* Password Confirm Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="reg-password-confirm" className="block text-xs font-semibold text-slate-700">
              비밀번호 확인
            </label>
            {passwordsMatch && (
              <span className="text-[11px] text-emerald-600 flex items-center gap-0.5 font-medium">
                <Check className="w-3.5 h-3.5" /> 일치함
              </span>
            )}
            {passwordsMismatch && (
              <span className="text-[11px] text-rose-500 flex items-center gap-0.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> 일치하지 않음
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-password-confirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                passwordsMismatch
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Terms check */}
        <div className="pt-1">
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              id="checkbox-terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="leading-tight">
              이용약관 및 개인정보 처리방침에 동의합니다 (필수)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-register-submit"
          disabled={loading || !isFormValid}
          className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>가입하고 시작하기</span>
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          id="btn-back-to-login"
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>이미 계정이 있으신가요? 로그인하기</span>
        </button>
      </div>
    </motion.div>
  );
};

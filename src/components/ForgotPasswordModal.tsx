import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthView } from '../types';

interface ForgotPasswordModalProps {
  onReset: (email: string, newPass: string) => void;
  onNavigate: (view: AuthView) => void;
  loading: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onReset,
  onNavigate,
  loading,
}) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return;
    onReset(email, newPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mb-3 shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">비밀번호 재설정</h1>
        <p className="text-sm text-slate-500 mt-1.5">
          {step === 'request'
            ? '가입하신 이메일 주소를 입력해 주세요.'
            : '새로운 비밀번호를 설정해 주세요.'}
        </p>
      </div>

      {step === 'request' ? (
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
              가입된 이메일 주소
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-verify-email"
            disabled={!email.trim()}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            계정 확인 및 다음 단계
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>이메일: <strong className="font-semibold">{email}</strong></span>
          </div>

          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              새로운 비밀번호 (6자 이상)
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새로운 비밀번호"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          <button
            type="submit"
            id="btn-confirm-reset-password"
            disabled={loading || newPassword.length < 6}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? '변경 중...' : '비밀번호 변경 완료'}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          id="btn-forgot-back-to-login"
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>로그인 화면으로 돌아가기</span>
        </button>
      </div>
    </motion.div>
  );
};

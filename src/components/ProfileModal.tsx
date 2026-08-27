import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Lock, Check } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onUpdateName: (newName: string) => void;
  onChangePassword: (currentPass: string, newPass: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateName,
  onChangePassword,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateName(name);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    onChangePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">내 정보 관리</h2>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5 pt-3 gap-6 text-sm">
          <button
            id="tab-profile-info"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'profile'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            프로필 정보
            {activeTab === 'profile' && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            id="tab-change-password"
            onClick={() => setActiveTab('password')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'password'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            비밀번호 변경
            {activeTab === 'password' && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'profile' ? (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">이메일 계정</label>
                <input
                  type="text"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">이메일은 변경할 수 없습니다.</span>
              </div>

              <div>
                <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이름 / 닉네임
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  id="btn-save-profile-name"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="current-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="current-pass"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  새 비밀번호 (6자 이상)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-pass"
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-pass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 확인"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                {newPassword && confirmPassword && newPassword === confirmPassword && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 비밀번호가 일치합니다.
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  id="btn-save-new-password"
                  disabled={!currentPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

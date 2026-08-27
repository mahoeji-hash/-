import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  User as UserIcon,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Users,
  Settings,
  ShieldCheck,
  StickyNote,
} from 'lucide-react';
import { User as UserType, UserMemo } from '../types';
import {
  getUserMemos,
  saveUserMemos,
  getUsers,
  loginUser,
} from '../utils/storage';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
  onOpenProfile: () => void;
  onSwitchUser: (user: UserType) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onOpenProfile,
  onSwitchUser,
  onShowToast,
}) => {
  const [memos, setMemos] = useState<UserMemo[]>(() => getUserMemos(user.id));
  const [newMemoText, setNewMemoText] = useState('');
  const [showAccountList, setShowAccountList] = useState(false);

  const registeredUsers = getUsers();

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoText.trim()) return;

    const newMemo: UserMemo = {
      id: `memo-${Date.now()}`,
      content: newMemoText.trim(),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    const updated = [newMemo, ...memos];
    setMemos(updated);
    saveUserMemos(user.id, updated);
    setNewMemoText('');
    onShowToast('success', '새 메모가 추가되었습니다.');
  };

  const handleToggleMemo = (id: string) => {
    const updated = memos.map((m) =>
      m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
    );
    setMemos(updated);
    saveUserMemos(user.id, updated);
  };

  const handleDeleteMemo = (id: string) => {
    const updated = memos.filter((m) => m.id !== id);
    setMemos(updated);
    saveUserMemos(user.id, updated);
    onShowToast('info', '메모가 삭제되었습니다.');
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
        d.getDate()
      ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
        d.getMinutes()
      ).padStart(2, '0')}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Navbar */}
      <header className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${user.avatarColor || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-base shadow-xs`}
          >
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/50">
                <ShieldCheck className="w-3 h-3" /> 인증됨
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-accounts-list"
            onClick={() => setShowAccountList(!showAccountList)}
            className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="등록된 계정 목록 보기 및 계정 전환"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">계정 목록</span> ({registeredUsers.length})
          </button>

          <button
            id="btn-open-profile-settings"
            onClick={onOpenProfile}
            className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>내 정보 관리</span>
          </button>

          <button
            id="btn-logout"
            onClick={onLogout}
            className="px-3.5 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* Account Switcher Drawer / Card */}
      <AnimatePresence>
        {showAccountList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold">등록된 계정 목록 (테스트 및 전환)</h3>
                </div>
                <span className="text-xs text-slate-400">클릭하여 다른 계정으로 즉시 전환</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {registeredUsers.map((u) => {
                  const isCurrent = u.id === user.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        if (!isCurrent) {
                          const res = loginUser(u.email, u.password);
                          if (res.user) {
                            onSwitchUser(res.user);
                            setMemos(getUserMemos(res.user.id));
                            onShowToast('success', `${res.user.name} 계정으로 전환되었습니다.`);
                          }
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-blue-600/20 border-blue-400 text-white'
                          : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className={`w-7 h-7 rounded-lg ${u.avatarColor || 'bg-blue-500'} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {u.name.slice(0, 1)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate leading-tight">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium shrink-0">
                          현재
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Account Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              <span>계정 기본 정보</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">이름</span>
                <span className="font-semibold text-slate-800 text-sm">{user.name}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">로그인 이메일</span>
                <span className="font-semibold text-slate-800 break-all">{user.email}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">가입일시</span>
                  <span className="font-medium text-slate-700">{formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">최근 로그인</span>
                  <span className="font-medium text-slate-700">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '방금 전'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xs">
            <h4 className="font-bold text-sm mb-1.5">🔒 개인 공간 보안 안내</h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              본 서비스는 가입된 계정별로 데이터가 안전하게 분리되어 저장됩니다. 상단에서 로그아웃하거나 다른 계정을 추가하여 언제든 테스트해보세요!
            </p>
          </div>
        </div>

        {/* Right Column (2 cols): Personal Private Memo Space */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <StickyNote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {user.name}님의 비공개 메모 & 할 일
                  </h3>
                  <p className="text-xs text-slate-400">
                    로그인한 계정에만 저장되는 개인 메모장입니다.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                총 {memos.length}개
              </span>
            </div>

            {/* Memo Add Form */}
            <form onSubmit={handleAddMemo} className="mb-5">
              <div className="flex gap-2">
                <input
                  id="input-new-memo"
                  type="text"
                  value={newMemoText}
                  onChange={(e) => setNewMemoText(e.target.value)}
                  placeholder="새로운 메모나 할 일을 적어보세요..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  id="btn-add-memo"
                  disabled={!newMemoText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>추가</span>
                </button>
              </div>
            </form>

            {/* Memos List */}
            <div className="space-y-2.5">
              {memos.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <StickyNote className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                  <p className="text-sm font-medium">작성된 메모가 없습니다.</p>
                  <p className="text-xs text-slate-400 mt-0.5">상단 입력창에서 첫 메모를 작성해보세요!</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {memos.map((memo) => (
                    <motion.div
                      key={memo.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                        memo.isCompleted
                          ? 'bg-slate-50 border-slate-200/80 text-slate-400'
                          : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        id={`toggle-memo-${memo.id}`}
                        onClick={() => handleToggleMemo(memo.id)}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                        aria-label={memo.isCompleted ? '완료 취소' : '완료 표시'}
                      >
                        {memo.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm whitespace-pre-wrap leading-relaxed ${
                            memo.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {memo.content}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {formatDate(memo.createdAt)}
                        </span>
                      </div>

                      <button
                        type="button"
                        id={`delete-memo-${memo.id}`}
                        onClick={() => handleDeleteMemo(memo.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                        title="메모 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../BrandLogo';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, loginAdmin } = useData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdmin(cleanEmail, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid administrator email or password.');
      } else {
        setEmail('');
        setPassword('');
      }
    } catch {
      setErrorMessage('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isLoading && setIsAdminLoginModalOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#18181b] border border-zinc-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner Strip */}
          <div className="bg-[#212121] px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" darkTheme={true} />
              <div className="h-5 w-px bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#EFF0A3]" />
                <span className="text-xs font-bold tracking-wider uppercase text-zinc-300">
                  CMS Admin Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAdminLoginModalOpen(false)}
              disabled={isLoading}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close admin login"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white tracking-tight">Admin Sign In</h2>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@thegridcoworking.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-[#EFF0A3] focus:ring-1 focus:ring-[#EFF0A3] rounded-xl text-sm text-white placeholder-zinc-500 transition-all outline-hidden"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="w-full pl-10 pr-11 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-[#EFF0A3] focus:ring-1 focus:ring-[#EFF0A3] rounded-xl text-sm text-white placeholder-zinc-500 transition-all outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="admin-login-submit-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#EFF0A3] hover:bg-[#dfe094] text-[#212121] text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#212121]" />
                    <span>Verifying on server...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#212121]" />
                    <span>Authenticate & Access CMS</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#212121]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

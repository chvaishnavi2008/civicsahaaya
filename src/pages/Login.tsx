import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNav } from '@/lib/navigation';
import { Shield, LogIn, UserPlus, Mail, Lock, User as UserIcon, Zap } from 'lucide-react';

export function Login() {
  const { signIn, signUp, setDemoMode } = useAuth();
  const { navigate } = useNav();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        navigate('dashboard');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      const { error } = await signUp(name, email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        navigate('dashboard');
      }
    }
  };

  const demoLogin = () => {
    setDemoMode(true);
    navigate('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'login' ? 'Sign in to access your dashboard' : 'Sign up to start using CivicSahaaya'}
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {/* Mode toggle */}
          <div className="flex p-1 mb-6 rounded-xl bg-gray-100 dark:bg-slate-800">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500'
              }`}
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'register' ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
          </div>

          <button onClick={demoLogin} className="btn-secondary w-full">
            <Zap className="w-4 h-4 text-accent-500" />
            Try Demo Without Login
          </button>
          <p className="text-xs text-center text-gray-400 mt-3">
            Demo mode lets you explore all features. Sign up to save your documents.
          </p>
        </div>
      </div>
    </div>
  );
}

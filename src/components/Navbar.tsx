import { useNav, type Route } from '@/lib/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Shield, Menu, X, Sun, Moon, LogOut, User as UserIcon, Home, Compass, FileText, CheckCircle, Upload, FolderOpen, HelpCircle, LogIn } from 'lucide-react';
import { useState } from 'react';

const navItems: { route: Route; label: string; icon: typeof Home }[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'rights-navigator', label: 'Rights Navigator', icon: Compass },
  { route: 'rti-assistant', label: 'RTI Assistant', icon: FileText },
  { route: 'scheme-eligibility', label: 'Scheme Eligibility', icon: CheckCircle },
  { route: 'document-explainer', label: 'Document Explainer', icon: Upload },
  { route: 'my-documents', label: 'My Documents', icon: FolderOpen },
  { route: 'help', label: 'Help', icon: HelpCircle },
];

export function Navbar() {
  const { route, navigate } = useNav();
  const { user, signOut, demoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary-700 dark:text-primary-300 hidden sm:block">
              CivicSahaaya
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800">
                  <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.user_metadata?.name || user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}

            {demoMode && !user && (
              <span className="hidden sm:block badge bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300">
                Demo Mode
              </span>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden py-3 border-t border-gray-200 dark:border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

import { AuthProvider, useAuth } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import { NavProvider, useNav } from '@/lib/navigation';
import { Navbar } from '@/components/Navbar';
import { ChatAssistant } from '@/components/ChatAssistant';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { RightsNavigator } from '@/pages/RightsNavigator';
import { RTIAssistant } from '@/pages/RTIAssistant';
import { SchemeEligibility } from '@/pages/SchemeEligibility';
import { DocumentExplainer } from '@/pages/DocumentExplainer';
import { MyDocuments } from '@/pages/MyDocuments';
import { Help } from '@/pages/Help';

function AppContent() {
  const { route } = useNav();
  const { user, demoMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-gray-500">Loading CivicSahaaya...</p>
        </div>
      </div>
    );
  }

  // Routes that require auth or demo mode
  const protectedRoutes = ['dashboard', 'my-documents'];
  const isProtected = protectedRoutes.includes(route);

  if (isProtected && !user && !demoMode) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Login />
        <ChatAssistant />
      </div>
    );
  }

  let page;
  switch (route) {
    case 'home':
      page = <Home />;
      break;
    case 'login':
      page = user || demoMode ? <Dashboard /> : <Login />;
      break;
    case 'register':
      page = user || demoMode ? <Dashboard /> : <Login />;
      break;
    case 'dashboard':
      page = <Dashboard />;
      break;
    case 'rights-navigator':
      page = <RightsNavigator />;
      break;
    case 'rti-assistant':
      page = <RTIAssistant />;
      break;
    case 'scheme-eligibility':
      page = <SchemeEligibility />;
      break;
    case 'document-explainer':
      page = <DocumentExplainer />;
      break;
    case 'my-documents':
      page = <MyDocuments />;
      break;
    case 'help':
      page = <Help />;
      break;
    default:
      page = <Home />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <main>{page}</main>
      <ChatAssistant />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavProvider>
          <AppContent />
        </NavProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

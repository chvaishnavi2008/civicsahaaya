import { createContext, useContext, useState, type ReactNode } from 'react';

export type Route =
  | 'home'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'rights-navigator'
  | 'rti-assistant'
  | 'scheme-eligibility'
  | 'document-explainer'
  | 'my-documents'
  | 'help';

interface NavContextValue {
  route: Route;
  navigate: (route: Route) => void;
  prefillQuery: string;
  setPrefillQuery: (q: string) => void;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [prefillQuery, setPrefillQuery] = useState('');

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <NavContext.Provider value={{ route, navigate, prefillQuery, setPrefillQuery }}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}

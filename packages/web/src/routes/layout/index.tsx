import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router';

import { AuthProvider } from '@/auth-context';
import { useSetup } from '@/setup-context';

import { Footer } from './footer';
import { Header } from './header';

export function Layout() {
  const { initialized } = useSetup();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized === false) {
      navigate('/setup', { replace: true });
    }
  }, [initialized, navigate]);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-zinc-50">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

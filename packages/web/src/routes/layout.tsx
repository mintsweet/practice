import { Outlet } from 'react-router';

import { Footer } from './components/footer';
import { Header } from './components/header';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

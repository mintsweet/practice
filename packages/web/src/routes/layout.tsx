import { Outlet } from 'react-router';

import { Footer } from './components/footer';
import { Header } from './components/header';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Practice" />
      <main className="flex-1 w-full flex">
        <div className="max-w-5xl mx-auto flex-1">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

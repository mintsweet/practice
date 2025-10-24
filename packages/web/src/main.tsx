import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import router from '@/app/router';
import { SetupProvider } from '@/setup-context';

import './setup';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SetupProvider>
      <RouterProvider router={router} />
    </SetupProvider>
  </StrictMode>,
);

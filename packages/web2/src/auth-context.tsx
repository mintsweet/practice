import { logout } from '@mints/request';
import { useRequest } from '@mints/request/react';
import { Spinner } from '@mints/ui';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import API from '@/api';
import type { IUser } from '@/api/auth';

type AuthContextValue = {
  status: 'unknown' | 'guest' | 'user';
  user: IUser | null;
  refresh: () => void;
  signout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [version, setVersion] = useState(0);

  const { loading, data } = useRequest(
    (signal) => API.auth.me(signal),
    [version],
  );

  const status: 'unknown' | 'guest' | 'user' = loading
    ? 'unknown'
    : data
      ? 'user'
      : 'guest';

  const signout = useCallback(async () => {
    await logout(() => API.auth.signout());
    setVersion((v) => v + 1);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        user: data ?? null,
        refresh: () => setVersion((v) => v + 1),
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status } = useAuth();
  const navigate = useNavigate();

  if (status === 'unknown') {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner size={50} />
      </div>
    );
  }

  if (status === 'guest') {
    navigate('/signin', { replace: true });
    return null;
  }

  return <>{children}</>;
};

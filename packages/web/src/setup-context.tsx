import { useRequest } from '@mints/request/react';
import { Spinner } from '@mints/ui';
import React, { createContext, useState, useContext, useEffect } from 'react';

import { getSetupStatus } from '@/api/setup';

interface SetupContextType {
  initialized: boolean;
  updateInitialized: (initialized: boolean) => void;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const SetupProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  const { loading, data } = useRequest(() => getSetupStatus(), []);

  useEffect(() => {
    setInitialized(data?.initialized || false);
  }, [data]);

  if (loading || !data) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
        <Spinner size={50} />
        <p className="text-zinc-600">Checking system status...</p>
      </div>
    );
  }

  return (
    <SetupContext.Provider
      value={{ initialized, updateInitialized: setInitialized }}
    >
      {children}
    </SetupContext.Provider>
  );
};

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
};

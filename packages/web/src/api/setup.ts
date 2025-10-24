import { request } from '@mints/request';

export interface SetupStatus {
  initialized: boolean;
}

export interface InitializeData {
  root: {
    email: string;
    password: string;
    nickname: string;
  };
  sections: Array<{ name: string; description: string }>;
  tags: Array<{ name: string; description: string }>;
}

export const getSetupStatus = (): Promise<SetupStatus> => {
  return request.public('/setup/status');
};

export const initializeSystem = (data: InitializeData) => {
  return request.public('/setup/initialize', {
    method: 'POST',
    data,
  });
};

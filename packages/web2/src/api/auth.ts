import { login, logout, request } from '@mints/request';

export interface IUser {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  signature?: string;
}

interface ISignUp {
  email: string;
  password: string;
  nickname: string;
}

export function signup(payload: ISignUp) {
  return request.public('/auth/signup', {
    method: 'POST',
    data: payload,
  });
}

interface ISignIn {
  email: string;
  password: string;
}

export async function signin(payload: ISignIn) {
  await login(async () => {
    const res = await request.public<{ accessToken: string }>('/auth/signin', {
      method: 'POST',
      data: payload,
    });
    return {
      accessToken: res.accessToken,
    };
  });
}

export async function signout() {
  await logout(() =>
    request('/auth/signout', {
      method: 'POST',
    }),
  );
}

export function me(signal?: AbortSignal): Promise<IUser | null> {
  return request.init('/auth/me', { signal });
}

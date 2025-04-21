export interface IUser {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
  signature?: string;
}

export async function getUser(): Promise<IUser | null> {
  return {
    id: 'user123',
    email: '123456@gmail.com',
    nickname: '小明',
  };
}

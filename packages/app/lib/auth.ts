export interface IAuth {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
  signature?: string;
}

export async function getAuth(): Promise<IAuth | null> {
  return {
    id: 'user123',
    email: '123456@gmail.com',
    nickname: '小明',
  };
}

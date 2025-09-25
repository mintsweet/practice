import { request } from '@mints/request';

interface IUser {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
  signature?: string;
  location?: string;
  followed: boolean;
  followersCount: number;
  followingCount: number;
}

export function queryById(id: string): Promise<IUser> {
  return request.auth(`/users/${id}`);
}

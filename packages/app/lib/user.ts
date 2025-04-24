import { ITopic } from './topic';

export interface IUser {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
  location?: string;
  signature?: string;
  followingCound: number;
  followerCount: number;
  isFollowed: boolean;
}

export async function getUser(userId: string): Promise<IUser> {
  return {
    id: userId,
    email: 'xxxx@gmail.com',
    followingCound: 1,
    followerCount: 10,
    isFollowed: false,
  };
}

export interface IUserAction {
  id: string;
  type: string;
  detail: {
    user?: Pick<IUser, 'id' | 'email' | 'avatar' | 'nickname' | 'signature'>;
    topic?: Pick<ITopic, 'id' | 'title'>;
  };
  createdAt: string;
}

export async function getUserActions(
  userId: string,
  actionType: string,
): Promise<IUserAction[]> {
  console.log(userId, actionType);
  return [];
}

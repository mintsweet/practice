import type { IAuth } from './auth';

export interface INotification {
  type: 'follow' | 'reply' | 'like' | 'collect' | 'system';
  actor?: IAuth;
  target?: {
    type: 'topic' | 'user';
    id: string;
    title?: string;
  };
  message: string;
  createdAt: string;
  isRead: boolean;
}

export async function getNotification(
  type: 'user' | 'system' = 'user',
): Promise<INotification[]> {
  if (type === 'system') {
    return [
      {
        type: 'system',
        message: '系统将在今晚 23:00-02:00 维护，请提前保存进度',
        createdAt: '2025-05-05 10:00',
        isRead: false,
      },
    ];
  }

  return [
    {
      type: 'follow',
      actor: {
        id: 'u1',
        email: 'xiaoming@gmail.com',
        nickname: '小明',
      },
      target: { type: 'user', id: 'myid' },
      message: '小明关注了你',
      createdAt: '2025-05-05 10:00',
      isRead: false,
    },
    {
      type: 'reply',
      actor: {
        id: 'u2',
        email: 'xiaohong@gmail.com',
        nickname: '小红',
      },
      target: { type: 'topic', id: 't1', title: '如何学习 TypeScript？' },
      message: '小红回复了你的话题',
      createdAt: '2025-05-05 11:00',
      isRead: false,
    },
    {
      type: 'like',
      actor: {
        id: 'u3',
        email: 'xiaoming@gmail.com',
        nickname: '小刚',
      },
      target: { type: 'topic', id: 't2', title: 'React 18 新特性总结' },
      message: '小刚点赞了你的话题',
      createdAt: '2025-05-05 12:00',
      isRead: false,
    },
    {
      type: 'collect',
      actor: {
        id: 'u4',
        email: 'xiaomei@gmail.com',
        nickname: '小美',
      },
      target: { type: 'topic', id: 't3', title: '前端工程化最佳实践' },
      message: '小美收藏了你的话题',
      createdAt: '2025-05-05 13:00',
      isRead: false,
    },
  ];
}

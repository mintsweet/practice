import type { IAuth } from './auth';

export interface ITopic {
  id: string;
  title: string;
  content: string;
  author: IAuth;
  tags: string[];
  like: number;
  comment: number;
  collect: number;
  view: number;
  createdAt: string;
}

export async function getTopics({
  sort = 'latest',
  page = 1,
}: {
  sort?: string;
  page?: number;
  q?: string;
} = {}): Promise<{ topics: ITopic[]; totalPage: number }> {
  const all: ITopic[] = [...Array(30)].map((_, i) => ({
    id: `topic-${i + 1}`,
    title: `这是第 ${i + 1} 条话题`,
    content: `内容预览段落 ${i + 1}，一些随机内容...`,
    author: {
      id: `user-${i % 5}`,
      email: `user${i % 5}@example.com`,
      nickname: `用户${i % 5}`,
    },
    tags: ['生活', '杂谈'],
    like: Math.floor(Math.random() * 50),
    comment: Math.floor(Math.random() * 20),
    collect: Math.floor(Math.random() * 10),
    view: Math.floor(Math.random() * 300),
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
  }));

  const sorted = [...all].sort((a, b) => {
    if (sort === 'popular') return b.like - a.like;
    if (sort === 'active') return b.comment - a.comment;
    if (sort === 'no-comment') return a.comment - b.comment;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pageSize = 10;
  const totalPage = Math.ceil(sorted.length / pageSize);
  const offset = (page - 1) * pageSize;
  const topics = sorted.slice(offset, offset + pageSize);

  return { topics, totalPage };
}

export async function getTopTopics(): Promise<
  Pick<ITopic, 'id' | 'title' | 'like' | 'comment'>[]
> {
  return [
    {
      id: 'pinned-1',
      title: '【社区规范】',
      like: 0,
      comment: 2,
    },
    {
      id: 'pinned-2',
      title: '【新人报道】',
      like: 5,
      comment: 13,
    },
    {
      id: 'pinned-3',
      title: '【新人必读】社区规范',
      like: 1,
      comment: 3,
    },
  ];
}

export async function getHotTopics(): Promise<
  Pick<ITopic, 'id' | 'title' | 'author'>[]
> {
  return [
    {
      id: 'hot-001',
      title: '大家是怎么决定要结婚的？有哪些考虑因素？',
      author: {
        id: 'u001',
        email: 'anon@forum.dev',
        nickname: '匿名用户',
      },
    },
    {
      id: 'hot-002',
      title: '怎么看一个小区是不是商品房？',
      author: {
        id: 'u002',
        email: 'doge@woof.com',
        nickname: '小狗狗',
      },
    },
    {
      id: 'hot-003',
      title: '自行车通勤，电脑应该怎么带才不累？',
      author: {
        id: 'u003',
        email: 'commute@city.com',
        nickname: '通勤族',
      },
    },
    {
      id: 'hot-004',
      title: '长期用 mac 给手机充电会伤电池吗？',
      author: {
        id: 'u004',
        email: 'maclover@icloud.com',
        nickname: 'Mac 用户',
      },
    },
    {
      id: 'hot-005',
      title: '关于背单词，总是背了忘怎么办？',
      author: {
        id: 'u005',
        email: 'memory@study.com',
        nickname: '单词选手',
      },
    },
    {
      id: 'hot-006',
      title: '今年的就业形势到底有多难？',
      author: {
        id: 'u006',
        email: 'jobhunt@nowhere.com',
        nickname: '打工人',
      },
    },
    {
      id: 'hot-007',
      title: '怎么看 uTools 非会员插件数量限制？',
      author: {
        id: 'u007',
        email: 'plugin@tools.dev',
        nickname: '插件控',
      },
    },
    {
      id: 'hot-008',
      title: '33 岁在上海还适合跳槽吗？',
      author: {
        id: 'u008',
        email: 'latecareer@job.com',
        nickname: '打工 10 年',
      },
    },
    {
      id: 'hot-009',
      title: '如何防止 PDF 文件被盗卖或反编译？',
      author: {
        id: 'u009',
        email: 'protect@docx.com',
        nickname: '安全第一',
      },
    },
    {
      id: 'hot-010',
      title: '有没有适合晚上听的安静播客推荐？',
      author: {
        id: 'u010',
        email: 'sleep@audio.fm',
        nickname: '耳朵放松',
      },
    },
  ];
}

export async function getTopic(topicId: string): Promise<
  ITopic & {
    replys: Array<{
      id: string;
      author: IAuth;
      content: string;
      createdAt: string;
    }>;
  }
> {
  return {
    id: topicId,
    title: '这是一个测试话题',
    content: '<p>这里是内容，可以包含 HTML...</p>',
    author: {
      id: 'u001',
      email: 'anon@forum.dev',
      nickname: '匿名用户',
    },
    tags: ['Tag1', 'Tag2'],
    like: 10,
    comment: 2,
    collect: 5,
    view: 100,
    createdAt: '2025-04-21T21:36:13.267Z',
    replys: [
      {
        id: 'r1',
        author: {
          id: 'u002',
          nickname: '小红',
          email: 'red@forum.dev',
        },
        content: '这是第一条评论，感谢你的分享！',
        createdAt: '2025-04-21T12:00:00.000Z',
      },
      {
        id: 'r2',
        author: {
          id: 'u003',
          nickname: '小蓝',
          email: 'blue@forum.dev',
        },
        content: '这个话题很有趣，期待更多内容。',
        createdAt: '2025-04-21T18:30:00.000Z',
      },
    ],
  };
}

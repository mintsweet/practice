import { request } from '@mints/request';

interface IQuery {
  page: number;
}

interface ITopic {
  id: string;
  title: string;
  content: string;
  visitCount: number;
  likeCount: number;
  collectCount: number;
  replyCount: number;
  createdAt: string;
  section: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    email: string;
    nickname?: string;
  };
  tags: string[];
}

export function query(
  params: IQuery,
): Promise<{ topics: ITopic[]; total: number }> {
  return request.public('/topics', {
    params,
  });
}

interface IReply {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    nickname?: string;
  };
}

export function queryById(
  id: string,
): Promise<ITopic & { replys: IReply[]; liked: boolean; collected: boolean }> {
  return request.public(`/topics/${id}`);
}

export function create(data: {
  title: string;
  content: string;
  sectionId: string;
}): Promise<string> {
  return request.auth('/topics', {
    method: 'POST',
    data,
  });
}

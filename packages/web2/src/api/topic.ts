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
    nickname: string;
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

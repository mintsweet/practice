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
  return request.auth(`/topics/${id}`);
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

export function addLike(id: string): Promise<{ status: 'OK' }> {
  return request.auth(`/topics/${id}/like`, {
    method: 'POST',
  });
}

export function removeLike(id: string): Promise<{ status: 'OK' }> {
  return request.auth(`/topics/${id}/like`, {
    method: 'DELETE',
  });
}

export function addCollect(id: string): Promise<{ status: 'OK' }> {
  return request.auth(`/topics/${id}/collect`, {
    method: 'POST',
  });
}

export function removeCollect(id: string): Promise<{ status: 'OK' }> {
  return request.auth(`/topics/${id}/collect`, {
    method: 'DELETE',
  });
}

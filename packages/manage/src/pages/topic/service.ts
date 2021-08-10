import { http } from '@/service/api';

// 创建话题
export const createTopic = (data: any) => http.post('/backend/topic', data);

// 删除话题
export const deleteTopic = (id: string) => http.del(`/backed/topic/${id}`);

// 更新话题
export const updateTopic = (id: string, data: any) =>
  http.put(`/backend/topic/${id}`, data);

// 根据话题ID获取话题详情
export const getTopicById = (id: string) => http.get(`/backend/topic/${id}`);

// 话题置顶
export const setTopicTop = (id: string) => http.put(`/backend/topic/${id}/top`);

// 话题加精
export const setTopicGood = (id: string) =>
  http.put(`/backend/topic/${id}/good`);

// 话题锁定(封贴)
export const setTopicLock = (id: string) =>
  http.put(`/backend/topic/${id}/lock`);

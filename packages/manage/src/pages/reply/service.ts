import { http } from '@/service/api';

// 删除回复
export const deleteReply = (id: string) => http.del(`/backend/reply/${id}`);

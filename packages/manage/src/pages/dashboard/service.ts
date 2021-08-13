import { http } from '@/service/api';

// 获取系统概览
export const getDashboard = () => http.get('/backend/dashboard');

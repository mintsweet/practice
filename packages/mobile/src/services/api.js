import axios from 'axios';
import { Toast } from 'vant';
import { getStorage, delStorage } from '@/utils/storage';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use(config => {
  const token = getStorage('token');

  if (token) {
    config.headers = {
      Authorization: token
    };
  }

  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(res => {
  return res.data;
}, err => {
  if (err.response.status === 401) {
    delStorage('token');
  }
  Toast(err.response.data);
  return Promise.reject(err.response.data);
});

// 登录
export const login = params => axios.post('/v1/signin', params);

// 获取当前用户信息
export const getUser = params => axios.get('/v1/info', params);

// 获取话题列表
export const getTopics = params => axios.get('/v1/topics/list', { params });

// 获取话题详情
export const getTopic = tid => axios.get(`/v1/topic/${tid}`);

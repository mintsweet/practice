import axios from 'axios';
import { message } from 'antd';
import { getStorage, delStorage } from '../utils/storage';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use(config => {
  const token = getStorage('token');

  if (token) {
    config.headers = {
      'Authorization': token
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
  message.error(err.response.data);
  return Promise.reject(err.response.data);
});

// 登录
export const signin = params => axios.post('/v1/signin', params);

// 忘记密码
export const forgetPass = user => axios.patch('/v1/forget_pass', user);

// 获取当前用户信息
export const getUser = () => axios.get('/v1/info');

// 获取用户列表
export const getUserList = params => axios.get('/v2/users/list', params);

// 创建用户
export const createUser = params => axios.post('/v2/users/create', params);

// 删除用户
export const deleteUser = id => axios.delete(`/v2/user/${id}/delete`);

// 用户加星
export const setUserStar = id => axios.patch(`/v2/user/${id}/star`);

// 用户锁定
export const setUserLock = id => axios.patch(`/v2/user/${id}/lock`);

// 获取本周新增用户数量
export const getNewUserThisWeek = () => axios.get('/v2/users/new_this_week');

// 获取上周新增用户数量
export const getNewUserLastWeek = () => axios.get('/v2/users/new_last_week');

// 获取用户总数量
export const getUserTotal = () => axios.get('/v2/users/total');

// 获取话题列表
export const getTopicList = params => axios.get('/v1/topics/list', params);

// 删除话题
export const deleteTopic = id => axios.delete(`/v2/topic/${id}/delete`);

// 话题置顶
export const setTopicTop = id => axios.patch(`/v2/topic/${id}/top`);

// 话题加精
export const setTopicGood = id => axios.patch(`/v2/topic/${id}/good`);

// 话题锁定
export const setTopicLock = id => axios.patch(`/v2/topic/${id}/lock`);

// 获取本周新增话题数量
export const getNewTopicThisWeek = () => axios.get('/v2/topics/new_this_week');

// 获取上周新增话题数量
export const getNewTopicLastWeek = () => axios.get('/v2/topics/new_last_week');

// 获取话题总数量
export const getTopicTotal = () => axios.get('/v2/topics/total');

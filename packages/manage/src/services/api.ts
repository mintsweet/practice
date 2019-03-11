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

export const signin = params => axios.post('/v1/signin', params);

export const getUser = () => axios.get('/v1/info');

export const getUserList = params => axios.get('/v2/users/list', params);

export const createUser = params => axios.post('/v2/users/create', params);

export const deleteUser = id => axios.delete(`/v2/user/${id}/delete`);

export const setUserStar = id => axios.patch(`/v2/user/${id}/star`);

export const setUserLock = id => axios.patch(`/v2/user/${id}/lock`);

import axios from 'axios';
import { Toast } from 'vant';
import { getStorage, delStorage } from '../utils/storage';

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
  Toast.fail(err.response.data);
  return Promise.reject(err.response.data);
});

import axios from 'axios';
import { getStorage } from '../utils/storage';

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
  return Promise.reject(err.response.data);
});

export const signin = params => axios.post('/v1/signin', params);

export const getUser = () => axios.get('/v1/info');

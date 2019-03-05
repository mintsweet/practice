import axios from 'axios';

axios.defaults.baseURL = '/api';

axios.interceptors.response.use(res => {
  return res.data;
}, (err) => {
  return Promise.reject(err.response.data);
});

export const signin = params => axios.post('/v1/signin', params);

import { Http, storage } from 'mints-utils';

const http = new Http('/', {
  requestBefore: config => {
    const token = storage.get('token');

    if (token) {
      config.headers = {
        Authorization: token,
      };
    }

    return config;
  },
});

// 登录
export const login = (data: object) => http.post('/signin', data);

// 获取当前用户信息
export const getCurrentUser = () => http.get('/info');

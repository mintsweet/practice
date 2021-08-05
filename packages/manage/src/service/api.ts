import { Http, storage } from 'mints-utils';

export const http = new Http('/', {
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

// 创建用户
export const createUser = (data: object) => http.post('/backend/user', data);

// 删除用户
export const deleteUser = (uid: string) => http.del(`/backend/user/${uid}`);

// 更新用户
export const updateUser = (uid: string, data: object) =>
  http.put(`/backend/user/${uid}`, data);

// 设为星标用户
export const setStarUser = (uid: string) =>
  http.put(`/backend/user/${uid}/star`);

// 锁定用户(封号)
export const setLockUser = (uid: string) =>
  http.put(`/backend/user/${uid}/lock`);

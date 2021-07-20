import Reate from 'reate';
import { storage } from 'mints-utils';
import * as API from '@/service/api';

export interface LoginPayload {
  email: string;
  password: string;
}

interface UserInfo {
  _id: string;
  email: string;
  nickname: string;
  avatar: string;
  score: number;
  location: string;
  signature: string;
}

interface State {
  status: number; // -1 登录错误 0 未登录 1 已登录
  error: string; // 错误信息
  info: UserInfo | null;
  autoLogin: boolean;
}

const initState: State = {
  status: 0,
  error: '',
  info: null,
  autoLogin: !!storage.get('autoLogin'),
};

export default new Reate(initState, {
  changeAutoLogin: (store, { autoLogin }) => {
    store.setState({
      autoLogin,
    });
  },
  login: async (store, payload: LoginPayload) => {
    try {
      const res = await API.login({
        ...payload,
        isBackend: true,
      });
      storage.set('token', res);
      store.dispatch('getUserInfo');
    } catch (err) {
      store.setState({
        status: -1,
        error: err.response.data,
        info: null,
      });
    }
  },
  getUserInfo: async store => {
    try {
      const res = await API.getCurrentUser();
      store.setState({
        status: 1,
        error: '',
        info: res,
      });
    } catch (err) {
      store.setState({
        status: -1,
        error: err.response.data,
        info: null,
      });
    }
  },
});

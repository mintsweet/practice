import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as API from '../services/api';
import { getStorage, setStorage, delStorage } from '../utils/storage';

export default {
  namespace: 'app',

  state: {
    collapsed: false,
    autoLogin: false,
    token: '',
    user: {},
  },

  reducers: {
    updateCollapsed(state) {
      return {
        ...state,
        collapsed: !state.collapsed
      }
    },

    updateAutoLogin(state) {
      setStorage('autoLogin', !state.autoLogin);
      return {
        ...state,
        autoLogin: !state.autoLogin
      }
    },

    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

  effects: {
    *signin({ payload }, { call, put }) {
      try {
        const token = yield call(API.signin, payload);
        setStorage('token', token);
        yield put({ type: 'update', payload: { token } });
        yield put(routerRedux.push('/'));
        message.success('登录成功', 1);
      } catch(err) {
        message.error(err);
      }
    },

    *signout({ payload }, { call, put }) {
      delStorage('token');
      yield put({ type: 'update', payload: { token: '', user: {} }});
      yield put(routerRedux.push('/user/login'));
      message.success('退出登录', 1);
    },

    *getUser({ payload }, { call, put }) {
      try {
        const user = yield call(API.getUser);
        yield put({ type: 'update', payload: { user } });
      } catch(err) {
        message.error(err);
      }
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      const autoLogin = getStorage('autoLogin') ? (getStorage('autoLogin') === 'false' ? false : true) : false;
      const token = getStorage('token') || '';
      dispatch({ type: 'update', payload: { autoLogin, token } });
    },
  },
}

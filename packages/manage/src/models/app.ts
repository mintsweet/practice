import { routerRedux } from 'dva/router';
import * as API from '../services/api';
import { getStorage, setStorage, delStorage } from '../utils/storage';

export default {
  namespace: 'app',

  state: {
    collapsed: false,
    autoLogin: false,
    loading: false,
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

    updateLoading(state) {
      return {
        ...state,
        loading: !state.loading
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
      const token = yield call(API.signin, payload);
      setStorage('token', token);
      yield put({ type: 'update', payload: { token } });
      yield put(routerRedux.push('/'));
    },

    *signout(_, { put }) {
      delStorage('token');
      yield put({ type: 'update', payload: { token: '', user: {} }});
      yield put(routerRedux.push('/user/login'));
    },

    *getUser(_, { call, put }) {
      const user = yield call(API.getUser);
      yield put({ type: 'update', payload: { user } });
    },

    *forgetPass(_, { call }) {
      yield call(API.forgetPass);
    }
  },

  subscriptions: {
    setup({ dispatch }) {
      const autoLogin = getStorage('autoLogin') ? (getStorage('autoLogin') === 'false' ? false : true) : false;
      const token = getStorage('token') || '';
      dispatch({ type: 'update', payload: { autoLogin, token } });
    },
  },
}

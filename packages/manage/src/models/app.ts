import { routerRedux } from 'dva/router';
import * as API from '../services/api';
import { storage } from 'mints-utils';

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
      storage.set('autoLogin', !state.autoLogin);
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
      const token = yield call(API.signin, payload);
      storage.set('token', token);
      yield put({ type: 'update', payload: { token } });
      yield put(routerRedux.push('/'));
    },

    *signout(_, { put }) {
      storage.del('token');
      yield put({ type: 'update', payload: { token: '', user: {} }});
      yield put(routerRedux.push('/user/login'));
    },

    *getUser(_, { call, put }) {
      const user = yield call(API.getUser);
      yield put({ type: 'update', payload: { user } });
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      const autoLogin = storage.get('autoLogin') ? (storage.get('autoLogin') === 'false' ? false : true) : false;
      const token = storage.get('token') || '';
      dispatch({
        type: 'update',
        payload: { autoLogin, token },
      });
    },
  },
}

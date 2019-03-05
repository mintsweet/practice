import * as API from '../services/api';

export default {
  namespace: 'app',

  state: {
    collapsed: false,
    autoLogin: false,
    token: ''
  },

  reducers: {
    updateCollapsed(state) {
      return {
        ...state,
        collapsed: !state.collapsed
      }
    },

    updateAutoLogin(state) {
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
      yield put({
        type: 'update',
        payload: {
          token
        },
      });
    },
  },
}

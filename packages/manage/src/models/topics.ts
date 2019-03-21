import * as API from '../services/api';

export default {
  namespace: 'topics',

  state: {
    list: [],
    page: null,
    size: null,
    total: null,
    last_week: 0,
    this_week: 0,
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

  effects: {
    *fetch({ payload: { page = 1, size = 10 } }, { call, put }) {
      const data = yield call(API.getTopicList, { page, size });
      yield put({
        type: 'update',
        payload: {
          list: data.topics,
          page,
          size,
          total: data.total,
        }
      });
    },

    *delete({ payload: { id } }, { call, put }) {
      yield call(API.deleteTopic, id);
      yield put({ type: 'reload' });
    },

    *top({ payload: { id } }, { call, put }) {
      yield call(API.setTopicTop, id);
      yield put({ type: 'reload' })
    },

    *good({ payload: { id } }, { call, put }) {
      yield call(API.setTopicGood, id);
      yield put({ type: 'reload' });
    },

    *lock({ payload: { id } }, { call, put }) {
      yield call(API.setTopicLock, id);
      yield put({ type: 'reload' });
    },

    *reload(_, { put, select }) {
      const page = yield select(state => state.topics.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *statis(_, { call, put }) {
      const this_week = yield call(API.getNewTopicThisWeek);
      const last_week = yield call(API.getNewTopicLastWeek);
      const total = yield call(API.getTopicTotal);

      yield put({
        type: 'update',
        payload: {
          total,
          this_week,
          last_week,
        },
      });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/content/topics') {
          dispatch({ type: 'fetch', payload: query });
        }

        if (pathname === '/dashboard') {
          dispatch({ type: 'statis' });
        }
      });
    },
  },
}

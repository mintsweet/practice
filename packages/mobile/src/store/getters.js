import { getStorage } from '@/utils/storage';

export default {
  token: state => {
    if (!state.app.token) {
      state.app.token = getStorage('token');
    }
    return state.app.token;
  },
  user: state => state.user,
  topics: state => state.topic.list,
  detail: state => state.topic.detail,
};

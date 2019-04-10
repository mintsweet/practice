import * as API from '@/services/api';

export default {
  state: {
    email: '',
    nickname: '',
    avatar: '',
    location: '',
    signature: '',
    score: '',
    topic_count: '',
    like_count: '',
    collect_count: '',
    follower_count: '',
    following_count: '',
    role: '',
    create_at: '',
  },

  mutations: {
    SAVE_USER(state, data) {
      state.email = data.email;
      state.nickname = data.nickname;
      state.avatar = data.avatar;
      state.location = data.location;
      state.signature = data.signature;
      state.score = data.score;
      state.topic_count = data.topic_count;
      state.like_count = data.like_count;
      state.collect_count = data.collect_count;
      state.follower_count = data.follower_count;
      state.following_count = data.following_count;
      state.role = data.role;
      state.create_at = data.create_at;
    },
  },

  actions: {
    async getUser({ commit }) {
      const data = await API.getUser();
      commit('SAVE_USER', data);
    },
  },
};

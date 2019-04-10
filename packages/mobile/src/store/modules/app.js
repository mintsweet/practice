import * as API from '@/services/api';
import { setStorage } from '@/utils/storage';

export default {
  state: {
    token: ''
  },

  mutations: {
    SAVE_TOKEN(state, token) {
      state.token = token;
      setStorage('token', token);
    }
  },

  actions: {
    async login({ commit }, params) {
      const token = await API.login(params);
      commit('SAVE_TOKEN', token);
    }
  }
};

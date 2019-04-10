import * as API from '@/services/api';

export default {
  state: {
    total: 0,
    pn: 1,
    ps: 10,
    list: [],
    tab: 'all',
  },

  mutations: {
    FETCH_TOPIC(state, data) {
      state.list = data.topics;
      state.total = data.total;
      state.pn = data.currentPage;
      state.ps = data.size;
      state.tab = data.currentTab;
    },
  },

  actions: {
    async getTopics({ state, commit }) {
      const data = await API.getTopics({
        size: state.ps,
        page: state.pn,
        tab: state.tab,
      });
      commit('FETCH_TOPIC', data);
    },
  },
};

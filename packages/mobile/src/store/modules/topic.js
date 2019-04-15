import * as API from '@/services/api';

export default {
  state: {
    total: 0,
    pn: 1,
    ps: 10,
    list: [],
    tab: 'all',
    id: '',
    detail: {}
  },

  mutations: {
    FETCH_TOPIC(state, data) {
      state.list = data.topics;
      state.total = data.total;
      state.pn = data.currentPage;
      state.ps = data.size;
      state.tab = data.currentTab;
    },

    FETCH_TOPIC_DETAIL(state, data) {
      state.detail = data;
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

    async getTopic({ state, commit }, id) {
      if (id !== state.id) {
        const data = await API.getTopic(id);
        commit('FETCH_TOPIC_DETAIL', data);
      }
    },
  },
};

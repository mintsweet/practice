export default {
  namespace: 'app',

  state: {
    collapsed: false,
  },

  reducers: {
    updateCollapsed(state) {
      return {
        ...state,
        collapsed: !state.collapsed
      }
    }
  }

}

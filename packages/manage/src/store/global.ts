import Reate from 'reate';

interface State {
  collapsed: boolean;
}

const initState: State = {
  collapsed: false,
};

export default new Reate(initState, {
  changeCollapsed: (store, { collapsed }) => {
    store.setState({ collapsed });
  },
});

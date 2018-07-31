import { createStore, combineReducers, compose } from 'redux';
import { user } from './user.reducer';

const store = createStore(combineReducers({ user }), compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;

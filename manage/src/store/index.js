import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { global } from './global.reducer';
import { user } from './user.reducer';
import { topic } from './topic.reducer';

const store = createStore(combineReducers({ global, user, topic }), compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;

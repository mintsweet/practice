import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { user } from './user.reducer';
import { post } from './post.reducer';

const store = createStore(combineReducers({ user, post }), compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { error } from './reducer/error';
import { status } from './reducer/status';
import { token } from './reducer/token';
import { ui } from './reducer/ui';
import { user } from './reducer/user';

const store = createStore(combineReducers({ error, status, token, ui, user }), compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;

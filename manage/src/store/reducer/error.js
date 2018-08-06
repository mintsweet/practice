import { ERROR } from '../types';

// reducer
export function error(state = '', action) {
  const { type, payload } = action;
  switch(type) {
    case ERROR:
      return payload;
    default:
      return state;
  }
}

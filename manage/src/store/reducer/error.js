import { ERROR } from '../types';

// 错误类型
const INIT = {
  way: '',
  content: ''
};

// reducer
export function error(state = INIT, action) {
  const { type, payload, way } = action;
  switch(type) {
    case ERROR:
      return { ...state, way, content: payload };
    default:
      return state;
  }
}

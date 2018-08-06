import { signin, forgetPass } from '@/service/api';
import { getLocal, setLocal } from '@/utils/local';
import { SIGNOUT, FORGET_PASS } from '../types';

// reducer
export function status(state = 0, action) {
  const { type, payload } = action;
  switch(type) {
    case SIGNOUT:
      return { ...state, status: 1 };
    case FORGET_PASS:
      return { ...state, status: 1 };
    default:
      return state;
  };
}

// 登出
export function signoutFunc() {
  return dispatch => {
    removeLocal('token');
    dispatch({ type: SIGNOUT });
  };
}

// 忘记密码
export function forgetPassFunc(user) {
  return async dispatch => {
    try {
      await forgetPass(user);
      dispatch({ type: FORGET_PASS });
    } catch(err) {
      dispatch({ type: 'ERROR', payload: err });
    }
  };
}

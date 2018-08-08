import { forgetPass } from '@/service/api';
import { removeLocal } from '@/utils/local';
import { SIGNOUT, FORGET_PASS, ERROR } from '../types';

// reducer
export function status(state = 0, action) {
  const { type } = action;
  switch(type) {
    case SIGNOUT:
      return 1;
    case FORGET_PASS:
      return 1;
    default:
      return state;
  };
}

// 登出
export function signoutAction() {
  return dispatch => {
    removeLocal('token');
    dispatch({ type: SIGNOUT });
  };
}

// 忘记密码
export function forgetPassAction(user) {
  return async dispatch => {
    try {
      await forgetPass(user);
      dispatch({ type: FORGET_PASS });
    } catch(err) {
      dispatch({ type: ERROR, payload: err });
    }
  };
}

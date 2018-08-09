import { getUserInfo } from '@/service/api';
import { removeLocal } from '@/utils/local';
import { SAVE_USER, ERROR } from '../types';

const INIT = {
  id: null
}

// reducer
export function user(state = INIT, action) {
  const { type, payload } = action;
  switch(type) {
    case SAVE_USER:
      return { ...state, ...payload };
    default:
      return state;
  }
}

// 保存用户信息
export function saveUserAction(token) {
  return async dispatch => {
    try {
      const user = await getUserInfo(token);
      if (user.role > 0) {
        dispatch({ type: SAVE_USER, payload: user });
      } else {
        throw '权限不足';
      }
    } catch(err) {
      removeLocal('token');
      dispatch({ type: ERROR, payload: err, way: SAVE_USER });
    }
  };
}

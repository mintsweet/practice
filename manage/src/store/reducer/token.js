import { signin } from '@/service/api';
import { getLocal } from '@/utils/local';
import { SAVE_TOKEN } from '../types';

export function token(state = getLocal('token') || '', action) {
  const { type, payload } = action;
  switch(type) {
    case SAVE_TOKEN:
      return { ...state, token: payload };
    default:
      return state;
  }
}

// 登录
export function signinFunc(user) {
  const info = {
    mobile: user.mobile
  };

  // 根据登录类型组装参数
  if (user.type === 'acc') {
    info.password = user.password;
  } else {
    info.issms = true;
    info.sms = user.sms;
  }

  return async dispatch => {
    try {
      const token = await signin(info);
      // 自动登录持久化存储
      if (user.autoLogin) {
        setLocal('token', token);
      }
      axios.defaults.headers.common['Authorization'] = token;
      dispatch({ type: SAVE_TOKEN, payload: token });
    } catch(err) {
      dispatch({ type: 'ERROR', payload: err });
    }
  };
}
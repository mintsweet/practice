import { signin, getUserInfo, forgetPass } from '@/service/api';
import { getLocal, setLocal, removeLocal } from '@/utils/local';

const SAVE_TOKEN = 'SAVE_TOKEN';
const SAVE_USER = 'SAVE_USER';
const SIGNOUT = 'SIGNOUT_SUCCESS';
const FORGET_PASS = 'FOGET_PASS_SUCCESS';
const ERROR = 'ERROR_USER';

const INIT = {
  status: 0,
  info: null,
  token: getLocal('token') || '',
  error: ''
};

// reducer
export function user(state = INIT, action) {
  const { type, payload } = action;
  switch(type) {
    case SAVE_TOKEN:
      return { ...state, status: 1, token: payload };
    case SAVE_USER:
      return { ...state, status: 1, info: payload, error: '' };
    case SIGNOUT:
      return { ...state, status: 1, info: null, token: '', error: '' };
    case FORGET_PASS:
      return { ...state, status: 1, error: '' };
    case ERROR:
      return { ...state, status: 0, info: null, token: '', error: payload };
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
      dispatch({ type: SAVE_TOKEN, payload: token });
    } catch(err) {
      dispatch({ type: ERROR, payload: err });
    }
  };
}

// 保存用户信息
export function saveUserFunc(token) {
  return async dispatch => {
    try {
      const user = await getUserInfo(token);
      if (user.role > 0) {
        dispatch({ type: SAVE_USER, payload: user });
      } else {
        throw '权限不足';
      }
    } catch(err) {
      dispatch({ type: ERROR, payload: err });
    }
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
      dispatch({ type: ERROR, payload: err });
    }
  };
}

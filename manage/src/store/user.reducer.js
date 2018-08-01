import { signin, getUserInfo } from '@/service/api';

const SUCCESS = 'USER_SUCCESS';
const ERROR = 'USER_ERROR';

const INIT = {
  info: {},
  token: '',
  error: ''
};

// reducer
export function user(state = {}, action) {
  const { type, payload } = action;
  switch(type) {
    case SUCCESS:
      return { ...state, info: payload, error: '' };
    case ERROR:
      return { ...state, info: {}, error: payload };
    default:
      return state;
  }
}

// 保存用户信息
export function saveCurrentUser(token) {
  return async dispatch => {
    try {
      const user = await getUserInfo(token);
      dispatch(success(user));
    } catch(err) {
      dispatch(error(err));
    }
  };
}

// 登录方法
export function signinFunc(user) {
  const info = {
    mobile: user.mobile
  };

  if (user.type === 'acc') {
    info.password = user.password;
  } else {
    info.issms = true;
    info.sms = user.sms;
  }

  return async dispatch => {
    try {
      const token = await signin(info);
      const user = await getUserInfo(token);

      if (user.role > 0) {
        dispatch(success(user));
      } else {
        throw new Error('权限不足');
      }
    } catch(err) {
      dispatch(error(err));
    }
  };
}

// 忘记密码
export function forgetPassFunc() {
  
}

function success(data) {
  return { type: SUCCESS, payload: data };
}

function error(msg) {
  return { type: ERROR, payload: msg };
}

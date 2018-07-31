import { signin, getUserInfo } from '@/service/api';

const SUCCESS = 'USER_SUCCESS';
const ERROR = 'USER_ERROR';

const INIT = {
  user: {},
  error: ''
};

// reducer
export function user(state = {}, action) {
  const { type, payload } = action;
  switch(type) {
    case SUCCESS:
      return { ...state, user: payload, error: '' };
    case ERROR:
      return { ...state, user: {}, error: payload };
    default:
      return state;
  }
}

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
      dispatch(error(err.response.data));
    }
  }
}

function success(data) {
  return { type: SUCCESS, payload: data };
}

function error(msg) {
  return { type: ERROR, payload: msg };
}

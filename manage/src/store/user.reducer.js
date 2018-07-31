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

function success(data) {
  return { type: SUCCESS, payload: data };
}

function error(msg) {
  return { type: ERROR, payload: msg };
}

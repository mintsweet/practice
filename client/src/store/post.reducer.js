import {
  getPostListApi
} from '@/service/api';
const SUCCESS = 'POST_SUCCESS';
const ERROR = 'POST_ERROR';
const POST_INIT = {
  error: '',
  posts: []
};

// reducer
export function post(state = POST_INIT, action) {
  const { type, payload } = action;
  switch(type) {
    case SUCCESS:
      return { ...state, posts: payload };
    case ERROR:
      return { ...state, error: payload };
    default:
      return state;
  }
}

export function getPostList() {
  return dispatch => {
    getPostListApi().then(res => {
      if (res.status === 1) {
        dispatch(success(res.data));
      } else {
        dispatch(error(res.message));
      }
    });
  }
}

function success(data) {
  return { type: SUCCESS, payload: data };
}

function error(msg) {
  return { type: ERROR, payload: msg };
}
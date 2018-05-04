import {
  getPostTopApi,
  getPostListApi
} from '@/service/api';
const TOP_SUCCESS = 'POST_TOP_SUCCESS';
const LIST_SUCCESS = 'POST_LIST_SUCCESS';
const ERROR = 'POST_ERROR';
const POST_INIT = {
  error: '',
  posts: [],
  tops: []
};

// reducer
export function post(state = POST_INIT, action) {
  const { type, payload } = action;
  switch(type) {
    case TOP_SUCCESS:
      return { ...state, tops: payload };
    case LIST_SUCCESS:
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
        dispatch(getListSuccess(res.data));
      } else {
        dispatch(error(res.message));
      }
    });
  }
}

export function getPostTop() {
  return dispatch => {
    getPostTopApi().then(res => {
      if (res.status === 1) {
        dispatch(getTopSuccess(res.data))
      } else {
        dispatch(error(res.message));
      }
    });
  }
}

function getListSuccess(data) {
  return { type: LIST_SUCCESS, payload: data };
}

function getTopSuccess(data) {
  return { type: TOP_SUCCESS, payload: data };
}

function error(msg) {
  return { type: ERROR, payload: msg };
}
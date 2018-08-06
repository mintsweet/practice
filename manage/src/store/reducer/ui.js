import { CHANGE_LOADING, CHANGE_COLLAPSED } from '../types';

const INIT = {
  loading: true,
  collapsed: false
};

// reducer
export function ui(state = INIT, action) {
  const { type, payload } = action
  switch(type) {
    case CHANGE_LOADING:
      return { ...state, loading: payload };
    case CHANGE_COLLAPSED:
      return { ...state, collapsed: payload };
    default:
      return state;
  }
}

// loading action
export function changeLoadingAction(payload) {
  return dispatch => {
    dispatch({ type: CHANGE_LOADING, payload });
  }
}

// collapsed action
export function changeCollapsedAction(payload) {
  return dispatch => {
    dispatch({ type: CHANGE_COLLAPSED, payload });
  };
}
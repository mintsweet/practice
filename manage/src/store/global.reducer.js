const CHANGE_COLLAPSED = 'CHANGE_COLLAPSED';

const INIT = {
  collapsed: false
};

// reducer
export function global(state = INIT, action) {
  const { type, payload } = action
  switch(type) {
    case CHANGE_COLLAPSED:
      return { ...state, collapsed: payload };
    default:
      return state;
  }
}

export function changeCollapsedAction(payload) {
  return dispatch => {
    dispatch({ type: CHANGE_COLLAPSED, payload });
  };
}
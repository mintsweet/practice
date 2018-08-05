const GET_TOPIC_LIST = 'GET_TOPIC_LIST';

const INIT = {
  list: []
};

// reducer
export function topic(state = INIT, action) {
  const { type, payload } = action;
  switch(type) {
    case GET_TOPIC_LIST:
      return { ...state, list: payload };
    default:
      return state;
  }
}

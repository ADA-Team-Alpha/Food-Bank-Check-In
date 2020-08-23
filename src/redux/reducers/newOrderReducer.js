const setWaitTimeReducer = (state = true, action) => {
  switch (action.type) {
    case "PLAY_NEW_ORDER_SOUND":
      return true;
    case "CLEAR_NEW_ORDER_SOUND":
      return false;
    default:
      return state;
  }
};

export default setWaitTimeReducer;

const setWaitTimeReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PENDING_ACCOUNTS":
      return action.payload;
    case "CLEAR_PENDING_ACCOUNTS":
      return [];
    default:
      return state;
  }
};

export default setWaitTimeReducer;

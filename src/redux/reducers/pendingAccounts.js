const setWaitTimeReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PENDING_ACCOUNTS":
      return action.payload;
    default:
      return state;
  }
};

export default setWaitTimeReducer;

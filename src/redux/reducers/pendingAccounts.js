const setWaitTimeReducer = (state = [{ id: 1 }, 3], action) => {
  switch (action.type) {
    case "SET_PENDING_ACCOUNTS":
      return action.payload;
    default:
      return state;
  }
};

export default setWaitTimeReducer;

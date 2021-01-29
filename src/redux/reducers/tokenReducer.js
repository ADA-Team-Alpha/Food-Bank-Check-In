const tokenReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_TOKEN_VALID":
      return true;
    case "SET_TOKEN_INVALID":
      return false;
    default:
      return state;
  }
};

export default tokenReducer;

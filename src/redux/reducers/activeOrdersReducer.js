const activeOrdersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ACTIVE_ORDERS":
      return [...action.payload];
    case "CLEAR_ACTIVE_ORDERS":
      return [];
    default:
      return state;
  }
};

export default activeOrdersReducer;
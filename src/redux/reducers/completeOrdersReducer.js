const completeOrdersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_COMPLETE_ORDERS":
      return [...action.payload];
    case "CLEAR_COMPLETE_ORDERS":
      return [];
    default:
      return state;
  }
};

export default completeOrdersReducer;
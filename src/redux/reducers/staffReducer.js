import { combineReducers } from 'redux';
import { state, dispatches } from '../../VariableTitles/VariableTitles';

const activeOrdersReducer = (state = [], action) => {
  switch (action.type) {
    case dispatches.ordersForStaff.setActiveOrders:
      return [...action.payload];
    case dispatches.ordersForStaff.clearActiveOrders:
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  [state.ordersForStaff.activeOrders]: activeOrdersReducer
});

import { combineReducers } from 'redux';
import { state, dispatches } from '../../VariableTitles/VariableTitles';

const activeOrdersReducer = (state = [], action) => {
  switch (action.type) {
    case dispatches.staff.setActiveOrders:
      return [...action.payload];
    case dispatches.staff.clearActiveOrders:
      return [];
    default:
      return state;
  }
};

const manualOrderClientInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case dispatches.staff.setSearchResultClientInfo:
      return action.payload;
    case dispatches.staff.clearSearchResultClientInfo:
      return {};
    default:
      return state;
  }
};

const manualOrderSuccessfullySubmittedReducer = (state = '', action) => {
  switch (action.type) {
    case dispatches.staff.setSuccessfullySubmittedManualClientOrder:
      return 'You successfully placed an order!';
    case dispatches.staff.clearSuccessfullySubmittedManualClientOrder:
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  [state.staff.activeOrders]: activeOrdersReducer,
  [state.staff.searchResultClientInfo]: manualOrderClientInfoReducer,
  [state.staff.submittedManualOrderSuccess]: manualOrderSuccessfullySubmittedReducer
});

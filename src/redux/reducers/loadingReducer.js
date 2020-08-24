import { combineReducers } from 'redux';
import { state, dispatches } from '../../VariableTitles/VariableTitles';

const serverIsLoadingReducer = (state = true, action) => {
  switch (action.type) {
    case dispatches.loading.setServerLoading:
      return true;
    case dispatches.loading.clearServerLoading:
      return false;
    default:
      return state;
  }
};

const staffGetUserIsLoadingReducer = (state = true, action) => {
  switch (action.type) {
    case dispatches.loading.setStaffGetClientIsLoading:
      return true;
    case dispatches.loading.clearStaffGetClientIsLoading:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  [state.loading.serverIsLoading]: serverIsLoadingReducer,
  [state.loading.staffGetClientIsLoading]: staffGetUserIsLoadingReducer
});

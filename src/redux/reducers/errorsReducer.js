import { combineReducers } from "redux";

// loginMessage holds the string that will display
// on the login screen if there's an error
const loginMessage = (state = "", action) => {
  switch (action.type) {
    case "CLEAR_LOGIN_ERROR":
      return "";
    case "LOGIN_INPUT_ERROR":
      return "Please enter your username and password!";
    case "LOGIN_FAILED":
      return "Oops! The email and password didn't match. Try again!";
    case 'FAILED_REQUEST':
      return "Oops! Something went wrong on our end, please try again shortly.";
    default:
      return state;
  }
};

// registrationMessage holds the string that will display
// on the registration screen if there's an error
const registrationMessage = (state = "", action) => {
  switch (action.type) {
    case "CLEAR_REGISTRATION_ERROR":
      return "";
    case "REGISTRATION_INPUT_ERROR":
      return "Please enter your information!";
    case "REGISTRATION_FAILED":
      return "Oops! That didn't work. The username might already be taken. Try again!";
    default:
      return state;
  }
};

// orderMessage holds the string that will display
// at the end of a client check-in if there's an error
// checking them in
const orderMessage = (state = "", action) => {
  switch (action.type) {
    case "SET_ORDER_PLACEMENT_ERROR":
      return 'Error placing order, please try again.';
    case "SET_RETRIEVE_ACTIVE_ORDER_ERROR":
      return 'Sorry, unable to update your order status. Someone will be with you shortly.';
    case "SET_ORDER_DECLINED_ERROR":
      return 'Sorry, your order has been declined. If you believe this to be a mistake please speak with someone from the Food Pantry.';
    case "CLEAR_ORDER_PLACEMENT_ERROR":
      return '';
    default:
      return state;
  }
};

// This message displays if a volunteer was unable to get accounts pending approval
// that's only displayed in the AccountRequest.js file.
const staffGetOrderMessage = (state = "", action) => {
  switch (action.type) {
    case "SET_UNABLE_TO_GET_ACTIVE_ORDERS_ERROR":
      return 'Error getting active orders, try refreshing the page.';
    case "CLEAR_UNABLE_TO_GET_ACTIVE_ORDERS_ERROR":
      return '';
    default:
      return state;
  }
};

// This message displays if a volunteer was unable to get active orders
// that's only displayed in the Orders.js file.
const staffGetPendingAccountsMessage = (state = "", action) => {
  switch (action.type) {
    case "SET_UNABLE_TO_GET_PENDING_ACCOUNTS_ERROR":
      return 'Error getting accounts that are pending approval, try refreshing the page.';
    case "CLEAR_UNABLE_TO_GET_PENDING_ACCOUNTS_ERROR":
      return '';
    default:
      return state;
  }
};

// This message displays if a volunteer was unable to place an order for a client
// that's only displayed in the Orders.js file.
const staffPlaceOrderMessage = (state = "", action) => {
  switch (action.type) {
    case "SET_STAFF_UNABLE_TO_PLACE_ORDER_ERROR":
      return 'Error placing a manual order. Please confirm you entered the correct information and that the client is approved to place orders.';
    case "CLEAR_STAFF_UNABLE_TO_PLACE_ORDER_ERROR":
      return '';
    default:
      return state;
  }
};

// make one object that has keys loginMessage, registrationMessage and orderMessage
// these will be on the redux state at:
// state.errors.loginMessage, state.errors.registrationMessage and state.errors.orderMessage
export default combineReducers({
  loginMessage,
  registrationMessage,
  orderMessage,
  staffPlaceOrderMessage,
  staffGetOrderMessage,
  staffGetPendingAccountsMessage
});

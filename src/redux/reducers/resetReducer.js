import { combineReducers } from "redux";

const validTokenStatus = (state = false, action) => {
  switch (action.type) {
    case "SET_TOKEN_VALID":
      return true;
    case "SET_TOKEN_INVALID":
      return false;
    default:
      return state;
  }
};

const passwordResetStatus = ((state = false, action) => {
  switch (action.type) {
    case "SET_SUCCESSFUL_PASSWORD_RESET":
      return true;
    case "SET_FAILED_PASSWORD_RESET":
      return false;
    default:
      return state;
  }
});

const passwordResetMessage = ((state = "", action) => {
  switch (action.type) {
    case "DISPLAY_SUCCESSFUL_PASSWORD_RESET_MESSAGE":
      return "You have successfully reset your password!";
    case "DISPLAY_PASSWORD_RESET_EMAIL_MESSAGE":
      return "If the email address you entered is linked to an account, you should get a email with a reset link.";
    case "CLEAR_PASSWORD_RESET_MESSAGE":
      return "";
    default:
      return state;
  }
});

export default combineReducers({
  validTokenStatus,
  passwordResetStatus,
  passwordResetMessage
});

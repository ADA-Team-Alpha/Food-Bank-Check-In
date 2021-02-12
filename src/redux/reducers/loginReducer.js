import { combineReducers } from "redux";

const loginMode = (state = "login", action) => {
  switch (action.type) {
    case "SET_TO_LOGIN_MODE":
      return "login";
    case "SET_TO_REGISTER_MODE":
      return "register";
    default:
      return state;
  }
};

const successfulRegistration = (state = "", action) => {
  switch (action.type) {
    case "DISPLAY_SUCCESSFUL_REGISTRATION_MESSAGE":
      return "You successfully registered!";
    case "CLEAR_SUCCESSFUL_REGISTRATION_MESSAGE":
      return "";
    default:
      return state;
  }
};

const successfulPasswordReset = (state = "", action) => {
  switch (action.type) {
    case "DISPLAY_SUCCESSFUL_RESET_MESSAGE":
      return "You successfully reset your password.";
    case "CLEAR_SUCCESSFUL_RESET_MESSAGE":
      return "";
    default:
      return state;
  }
};

export default combineReducers({
  loginMode,
  successfulRegistration,
  successfulPasswordReset
});

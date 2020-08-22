import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./Header.css";

// The Header component is a simple header --> it contains the logo and the logout button.

const Header = (props) => (
  <AppBar position="static" id="navBar" xs={12}>
    <Toolbar>
      <img src="EFP_Logo_Color.png" alt="Emergency Food Pantry" id="headerLogo"/>
        <button
          id="logoutButton"
          onClick={() => {
            props.dispatch({ type: 'SET_SERVER_LOADING' });
            props.dispatch({ type: "LOGOUT" },
            props.history.push('/login')
          )}}
        >
          Log Out
        </button>
    </Toolbar>
  </AppBar>
);

export default (withRouter(connect()(Header)));

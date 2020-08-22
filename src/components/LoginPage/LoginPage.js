import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Toast from "react-bootstrap/Toast";
import "./LoginPage.css";

// The LoginPage component is a simple login page that contains two imputs
// that take in a user's email and password.  They have the option to click
// "Register" to create an account.  This LoginPage is on the /login route.

class LoginPage extends Component {
  state = {
    email: "",
    password: "",
    show: false
  };

  handleClose = () => this.setState({ show: false });

  // login function --> dispatches with a payload of the user email and 
  // password to log that user in and grab the information from that account
  login = (event) => {
    event.preventDefault();

    if (this.state.email && this.state.password) {
      this.props.dispatch({
        type: "LOGIN",
        payload: {
          username: this.state.email,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  };
  // end login

  // Setting state based on the user input so we can dispatch that info
  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {
    return (
      <div id="loginBody">
        <Container id="loginContainer">
          <Row id="loginRow">
              <Card id="loginCard">
                <form onSubmit={this.login}>
                  <div id="welcomeDiv">
                    <h1 id="login">Login</h1>
                    <AccountCircleIcon />
                  </div>
                  <div id="inputDiv">
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="userLoginInput"
                        value={this.state.email}
                        onChange={this.handleInputChangeFor("email")}
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="userLoginInput"
                        value={this.state.password}
                        onChange={this.handleInputChangeFor("password")}
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      className="log-in"
                      type="submit"
                      name="submit"
                      value="Login"
                      id="loginButton"
                    />
                  </div>
                </form>
              </Card>
          </Row>
          <Row>
            <center id="center">
              Don't have an account?{" "}
              <Link to="/register">
                <button className="changeButton">Register</button>
              </Link>
            </center>
          </Row>
          {/* If there were to be an error, this is where it would display. */}
          <Row>
            <div id="errorDiv">
              {this.props.errors.loginMessage && (
                <Toast animation="true" style={{ border: "1px solid #b13324" }}>
                  <Toast.Body>{this.props.errors.loginMessage}</Toast.Body>
                </Toast>
              )}
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}

// Bringing in the errorReducers to handle errors like incorrect login information
const mapStateToProps = (state) => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(LoginPage);

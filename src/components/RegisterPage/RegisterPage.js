import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Toast from "react-bootstrap/Toast";
import { withRouter } from "react-router-dom";
import "./RegisterPage.css";

// The RegisterPage component is similar to LoginPage
// It displays 4 inputs, a name, email, household ID and password.
// The user can choose to click "Login" if they already have
// an account.  The RegisterPage is on the /register route.

class RegisterPage extends Component {
  state = {
    name: "",
    email: "",
    household_id: "",
    password: "",
  };

  // registerUser function --> dispatches with a payload of the user name, email 
  // household ID and passowrd to register that new user
  registerUser = (event) => {
    event.preventDefault();

    if (
      this.state.name &&
      this.state.email &&
      this.state.household_id &&
      this.state.password
    ) {
      this.props.dispatch({
        type: "REGISTER",
        payload: {
          name: this.state.name,
          email: this.state.email,
          household_id: this.state.household_id,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: "REGISTRATION_INPUT_ERROR" });
    }
  };
  // end registerUser

  componentDidUpdate() {
    this.props.successfulRegistration && this.props.history.push("/login");
  }

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {
    return (
      <div id="registerBody">
        <Container id="registerContainer">
          <Row id="registerRow">
            <Card id="registerCard">
              <form onSubmit={this.registerUser}>
                <div id="welcomeDiv">
                  <h1 id="register">Register</h1>
                  <AssignmentIcon />
                </div>
                <div id="registerDiv">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="userRegisterInput"
                      value={this.state.name}
                      onChange={this.handleInputChangeFor("name")}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="userRegisterInput"
                      value={this.state.email}
                      onChange={this.handleInputChangeFor("email")}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="household_id"
                      placeholder="Household ID"
                      className="userRegisterInput"
                      value={this.state.household_id}
                      onChange={this.handleInputChangeFor("household_id")}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="userRegisterInput"
                      value={this.state.password}
                      onChange={this.handleInputChangeFor("password")}
                    />
                  </div>
                </div>
                <div>
                  <input
                    className="register"
                    type="submit"
                    name="submit"
                    value="Register"
                    id="registerButton"
                  />
                </div>
                {/* If there were to be an error, this is where it is displayed. */}
                <div id="errorDiv">
                  {this.props.error && (
                    <Toast style={{ border: "1px solid #b13324" }}>
                      <Toast.Body>{this.props.error}</Toast.Body>
                    </Toast>
                  )}
                </div>
              </form>
            </Card>
          </Row>
          <Row>
            <center id="center">
              Already have an account?{" "}
              <Link to="/login">
                <button className="changeButton">Login</button>
              </Link>
            </center>
          </Row>
        </Container>
      </div>
    );
  }
}

// Bringing in the errors for error handling, successfulRegistration 
// to push history to /login, and loginMode so as soon as a new user
// registers they are then logged in automatically.
const mapStateToProps = (state) => ({
  error: state.errors.registrationMessage,
  successfulRegistration: state.login.successfulRegistration,
  loginMode: state.login.loginMode
});

export default withRouter(connect(mapStateToProps)(RegisterPage));

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Toast from "react-bootstrap/Toast";
import "./RegisterPage.css";


class RegisterPage extends Component {
  state = {
    name: "",
    email: "",
    household_id: "",
    password: "",
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.name && this.state.email && this.state.household_id && this.state.password) {
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
  }; // end registerUser

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {
    return (
      <div>
        <div></div>
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
                    id="loginButton"
                  />
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
            <Row>
              <div id="errorDiv">
                {this.props.errors.registrationMessage && (
                  <Toast style={{ border: "1px solid #b13324" }}>
                    {/* <Toast.Header>
                    <img
                      src="holder.js/20x20?text=%20"
                      className="rounded mr-2"
                      alt=""
                      onClick={this.handleClose}
                    />
                    <strong className="mr-auto" style={{ color: "#b13324" }}>
                      !
                    </strong>
                  </Toast.Header> */}
                    <Toast.Body>{this.props.errors.registrationMessage}</Toast.Body>
                  </Toast>
                )}
              </div>
            </Row>
        </Container>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
const mapStateToProps = (state) => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

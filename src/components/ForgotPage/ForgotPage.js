import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Route,
  Switch,
} from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Toast from "react-bootstrap/Toast";
import { withRouter } from "react-router-dom";
import "./ForgotPage.css";
import ResetPage from "./ResetPage.js"

// The user types in their email and if an account exists under
// that, an email is sent to them with a link. 
// The ForgotPage is on the /forgot route.

class ForgotPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };
  }


  resetPasswordEmail = (event) => {
    event.preventDefault();

    if (this.state.email) {
      this.props.dispatch({
        type: "RESET_PASSWORD_EMAIL",
        payload: {
          email: this.state.email,
        },
      });
    } else {
      this.props.dispatch({ type: "RESET_ERROR" });
    }
  };

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.url}/:token`}>
          <ResetPage />
        </Route>
        <Route path={match.url}>
          <div id="forgotBody">
            <Container id="forgotContainer">
              <Row id="row">
                <Card id="card">
                  <form onSubmit={this.resetPasswordEmail}>
                    <div id="welcomeDiv">
                      <h1 id="title">Forgot Password?</h1>
                      <AssignmentIcon />
                    </div>
                    <div id="forgotDiv">
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="formInput"
                          value={this.state.email}
                          onChange={this.handleInputChangeFor("email")}
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        className="formInput"
                        type="submit"
                        name="submit"
                        value="Send Email"
                        id="formButton"
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
            </Container>
          </div>
        </Route>
      </Switch>
    );
  }
}

// Bringing in the errors for error handling
const mapStateToProps = (state) => ({
  error: state.errors.registrationMessage,
});

export default withRouter(connect(mapStateToProps)(ForgotPage));

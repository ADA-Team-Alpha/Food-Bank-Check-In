import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Toast from "react-bootstrap/Toast";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BlockIcon from '@material-ui/icons/Block';

class ResetPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPassword: "",
            newPasswordRetyped: "",
        }
    }
    componentDidMount() {
        const { token } = this.props.match.params; 
        this.props.dispatch({
            type: "VALIDATE_PASSWORD_RESET_TOKEN",
            payload: {
                token: token,
            },
        });
    }

    componentDidUpdate() {
      this.props.successfulPasswordReset && this.props.history.push("/login");
    }

    resetPassword = (event) => {
        event.preventDefault();

        const { token } = this.props.match.params;
        if (this.state.newPassword && this.state.newPasswordRetyped === this.state.newPassword) {
            this.props.dispatch({
                type: "RESET_PASSWORD",
                payload: {
                    token: token,
                    newPassword: this.state.newPassword
                },
            });
        } else {
            this.props.dispatch({ type: "RESET_ERROR" });
        }
    };

    handleInputChangeFor = (propertyName) => (event) => {
        this.setState({
         [propertyName]: event.target.value
        });
    };

    render() {
        const validToken = this.props.validToken;
        const passwordsMatch = this.state.newPasswordRetyped === this.state.newPassword;
        return (
            <div id="forgotBody">
            <Container id="forgotContainer">
              <Row id="row">
                <Card id="card">
                {validToken ?
                  <form onSubmit={this.resetPassword}>
                    <div id="welcomeDiv">
                      <h1 id="title">New Password</h1>
                      <AssignmentIcon />
                    </div>
                    <div id="forgotDiv">
                        <div>
                            <p>Passwords must match {passwordsMatch ? <CheckCircleIcon className="true" /> : <BlockIcon className="false"/>}</p>
                        </div>
                      <div>
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="Type in new Password"
                          className="formInput"
                          value={this.state.newPassword}
                          onChange={this.handleInputChangeFor("newPassword")}
                        />
                        <input
                          type="password"
                          name="newPasswordRetyped"
                          placeholder="Retype Password"
                          className="formInput"
                          value={this.state.newPasswordRetyped}
                          onChange={this.handleInputChangeFor("newPasswordRetyped")}
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        className="formInput"
                        type="submit"
                        name="submit"
                        value="Reset"
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
                :
                    <>
                      <div id="welcomeDiv">
                        <h1 id="title">Invalid Token</h1>
                        <AssignmentIcon />
                      </div>
                      <div id="forgotDiv">
                      </div>
                    </>
                }
                </Card>
              </Row>
            </Container>
          </div>
        );
    }
}


const mapStateToProps = (state) => ({
  error: state.errors.passwordResetMessage,
  validToken: state.passwordReset.validTokenStatus,
  successfulPasswordReset: state.passwordReset.resetPasswordStatus
});

export default withRouter(connect(mapStateToProps)(ResetPage));

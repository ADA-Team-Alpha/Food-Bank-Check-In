import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import "./Dashboard.css";

class UpdateAccountPendingStatus extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_PENDING_ACCOUNTS' });
  }

  render() {
    console.log(this.props.pendingAccounts);
    return (
      <>
        <Container>
          <Form.Row xs={12}>
            <>
              cool
              {this.props.pendingAccounts.map((account, index) =>
                <button
                  key={`button-to-accept-account-${index}`}
                  onChange={() => this.props.dispatch({ type: 'UPDATE_PENDING_ACCOUNT', payload: account })}
                />
              )}
              <button
                // key={`button-to-accept-account-${index}`}
                onChange={() =>
                  this.props.dispatch({ type: 'UPDATE_PENDING_ACCOUNT', payload: 'account' })
                }
              />
            </>
          </Form.Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  pendingAccounts: state.pendingAccounts
});

export default connect(mapStateToProps)(UpdateAccountPendingStatus);

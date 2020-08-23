import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import "./Dashboard.css";

class UpdateAccountPendingStatus extends Component {
  state = {
    pendingInterval: null
  }

  componentDidMount = () => {
    const pendingInterval = setInterval(
      () => this.props.dispatch({ type: "FETCH_PENDING_ACCOUNTS" }),
      10 * 1000
    );
    this.setState({
      pendingInterval: pendingInterval,
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.pendingInterval);
  };

  render() {
    return (
      <>
        <Container>
          <Form.Row xs={12}>
            <Col xs={12} sm={12} md={12} lg={4} xl={4}>
              <Card>
                <form className="dashForm">
                  <h1 id="thirdColTitle">Clients Checked In</h1>
                  <Table responsive hover>
                    <tbody>
                      {this.props.pendingAccounts.map((account, index) => (
                        <tr
                          key={`button-to-accept-account-${index}`}
                          onClick={() => this.props.dispatch({ type: 'UPDATE_PENDING_ACCOUNT', payload: { id: account.id, approved: true }})}
                        >
                          <td>
                            {JSON.stringify(account)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </form>
              </Card>
            </Col>
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

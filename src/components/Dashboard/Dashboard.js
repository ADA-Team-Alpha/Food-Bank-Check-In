import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Orders from "./Orders";
import AccountRequests from "./AccountRequests";
import HomeIcon from "@material-ui/icons/Home";
import "./Dashboard.css";

// The Dashboard component is for the dashboard view that is seen by the staff/volunteers.
class Dashboard extends Component {
  state = {
    showAccountRequestsPage: false
  };

  componentDidMount() {
    this.props.dispatch({ type: "FETCH_PENDING_ACCOUNTS" });
    this.props.dispatch({ type: "FETCH_ACTIVE_ORDERS" });
  }

  render() {
    return (
      <>
        <Container fluid id="dashContainer">
          {/* Dashboard title row */}
          <Row>
            <div id="orangeDiv">
              <HomeIcon
                fontSize="large"
                style={{ fill: "#424B54" }}
                id="homeIcon"
              />
              <h1 id="dashboardTitle">Dashboard</h1>
            </div>
          </Row>
          <button
            id='toggleViewModeButton'
            onClick={() => this.setState({ showAccountRequestsPage: !this.state.showAccountRequestsPage })}
          >
            {this.state.showAccountRequestsPage ? 'Active Orders' : 'Pending Accounts'}
          </button>
          {this.state.showAccountRequestsPage ?
            <AccountRequests />
            :
            <Orders />
          }
        </Container>
      </>
    );
  }
}

export default connect()(Dashboard);

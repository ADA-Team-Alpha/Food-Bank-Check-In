import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Orders from "./Orders";
import AccountRequests from "./AccountRequests";
import HomeIcon from "@material-ui/icons/Home";
import Sound from 'react-sound';
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
    // this.props.newOrder && this.playSound();
    return (
      <>
      <Sound
          url='/Sounds/new_order.wav'
      />
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
            onClick={() => this.setState({ showAccountRequestsPage: !this.state.showAccountRequestsPage })}
          >
            Switch
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

const mapStateToProps = (state) => ({
  newOrder: state.newOrder
});

export default connect(mapStateToProps)(Dashboard);

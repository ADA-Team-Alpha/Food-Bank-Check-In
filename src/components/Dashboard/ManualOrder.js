import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import "./Dashboard.css";

// The ManualOrder component is viewed by staff members on the dashboard.
// Based on conditional rendering, it will be displayed in the second column
// on the dashboard.  This is how a staff member will manually check-in a client.
class ManualOrder extends Component {
  // Setting state here for when a staff member would need to manually check-in a client.
  state = {
    locationID: "",
    dietaryRestrictions: "",
    walkingHome: false,
    pregnant: false,
    childBirthday: false,
    snap: false,
    other: "",
    waitTime: "",
    houseHoldId: "",
    waitTimeMinutes: "15",
    pickup_name: "",
  };

  render() {
    return (
      <>
        <Container id="checkInContainer">
          <Row id="clientInfoRow">
            <div id="secondColManualHeader">
              <h1 id="secondColManualTitle">Manually check in a client.</h1>
              <button
                id="cancelButton"
                className="btn btn-large btn-primary"
                onClick={() => this.props.toggleShowClientInfo()}
              >
                Cancel
              </button>
            </div>
          </Row>
          {/* This is the exact same information as what is included in the CheckIn component. */}
          <Form.Row xs={12}>
            <>
              <div id="clientQuestions">
                <label id="idManualLabel" htmlFor="houseHoldIdManual">
                  Enter Household ID:
                  <br></br>
                  <input
                    type="number"
                    name="houseHoldIdManual"
                    id="houseHoldIdInput"
                    value={this.state.houseHoldId}
                    onChange={(event) =>
                      this.setState({ houseHoldId: event.target.value })
                    }
                  />
                </label>
                <form>
                  <label htmlFor="name" id="parkingLabelManual">
                    Choose parking spot:
                    <br></br>
                    <select
                      name="parking"
                      value={this.state.locationID}
                      id="parkingNumberManual"
                      onChange={(event) =>
                        this.setState({ locationID: event.target.value })
                      }
                    >
                      <>
                        {this.props.parkingLocations.map((location, index) => (
                          <option
                            value={location.id}
                            key={`parking-locations-${index}`}
                          >
                            {location.description}
                          </option>
                        ))}
                      </>
                    </select>
                  </label>
                </form>
                <label htmlFor="pickup_name" id="nameLabel">
                  Name of person picking up:
                  <br></br>
                  <textarea
                    rows="2"
                    cols="40"
                    name="name"
                    value={this.state.pickup_name}
                    onChange={(event) =>
                      this.setState({
                        pickup_name: event.target.value,
                      })
                    }
                    placeholder="Full Name"
                  ></textarea>
                </label>
                <br></br>
                <label htmlFor="foodRestrictions" id="foodRestrictionsLabel">
                  Please list any food restrictions here:
                  <br></br>
                  <textarea
                    rows="2"
                    cols="40"
                    name="foodRestrictions"
                    value={this.state.dietaryRestrictions}
                    onChange={(event) =>
                      this.setState({
                        dietaryRestrictions: event.target.value,
                      })
                    }
                    placeholder="Example: Dairy, peanuts"
                  ></textarea>
                </label>
                <br></br>
                <label htmlFor="walking" className="checkboxLabel">
                  Are you walking home?
                  <input
                    type="checkbox"
                    id="walkingHome"
                    className="check"
                    name="walkingHome"
                    checked={this.state.walkingHome}
                    onChange={() =>
                      this.setState({ walkingHome: !this.state.walkingHome })
                    }
                  />
                </label>
                <br></br>
                <label htmlFor="birthday" className="checkboxLabel">
                  Is there a child in the household with a birthday in the next{" "}
                  <br></br>
                  2 months?
                  <input
                    type="checkbox"
                    id="childBirthday"
                    className="check"
                    name="birthday"
                    checked={this.state.childBirthday}
                    onChange={() =>
                      this.setState({
                        childBirthday: !this.state.childBirthday,
                      })
                    }
                  />
                </label>
                <br></br>
                <label htmlFor="pregnant" className="checkboxLabel">
                  Is there a woman in the household who is pregnant?
                  <input
                    type="checkbox"
                    id="pregnant"
                    className="check"
                    name="pregnant"
                    checked={this.state.pregnant}
                    onChange={() =>
                      this.setState({ pregnant: !this.state.pregnant })
                    }
                  />
                </label>
                <br></br>
                <label htmlFor="snap" className="checkboxLabel">
                  Are you currently receiving SNAP?
                  <input
                    type="checkbox"
                    id="snap"
                    className="check"
                    name="snap"
                    checked={this.state.snap}
                    onChange={() => this.setState({ snap: !this.state.snap })}
                  />
                </label>
                <br></br>
                <label htmlFor="other" className="checkboxLabel">
                  Please list any other needs:
                  <br></br>
                  <textarea
                    rows="2"
                    cols="40"
                    id="other"
                    name="other"
                    placeholder="Example: Baby supplies, hygiene, pet needs"
                    value={this.state.other}
                    onChange={(event) =>
                      this.setState({ other: event.target.value })
                    }
                  />
                </label>
                <br />
                {/* On submit of the form, we dispatch to "SUBMIT_ORDER" with a payload of 
                all the new state set by the staff input.  Then the
                manual order is complete.  And we can show the client info again.*/}
                <button
                  id="submitButtonManual"
                  onClick={() => {
                    this.props.dispatch({
                      type: "CLEAR_ORDER_PLACEMENT_ERROR",
                    });
                    this.props.dispatch({
                      type: "SUBMIT_ORDER",
                      payload: {
                        location_id: this.state.locationID,
                        dietary_restrictions: this.state.dietaryRestrictions,
                        walking_home: this.state.walkingHome,
                        pregnant: this.state.pregnant,
                        child_birthday: this.state.childBirthday,
                        snap: this.state.snap,
                        pickup_name: this.state.pickup_name,
                        other: this.state.other,
                        wait_time_minutes: this.state.waitTimeMinutes,
                      },
                    });
                    this.props.toggleShowClientInfo();
                  }}
                >
                  Submit
                </button>
              </div>
            </>
          </Form.Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  activeOrders: state.activeOrders,
  completeOrders: state.completeOrders,
  parkingLocations: state.parkingLocations,
});

export default connect(mapStateToProps)(ManualOrder);

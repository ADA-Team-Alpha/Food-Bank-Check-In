import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import "./Dashboard.css";
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { dispatches, state, database, localState } from '../../VariableTitles/VariableTitles';
import { CircularProgress } from '@material-ui/core';
const requests = dispatches.requests;

const locationID = localState.locationID;
const householdID = localState.householdID;
const dietaryRestrictions = localState.dietaryRestrictions;
const walkingHome = localState.walkingHome;
const pregnant = localState.pregnant;
const childBirthday = localState.childBirthday;
const snap = localState.snap;
const other = localState.other;
const pickupName = localState.pickupName;
const waitTimeMinutes = localState.waitTimeMinutes;

const clientName = 'clientName';
const showPersonPickupTextBox = 'showPersonPickupTextBox';
const autoFilledInfo = 'autoFilledInfo';

const id = database.account.id;

// The ManualOrder component is viewed by staff members on the dashboard.
// Based on conditional rendering, it will be displayed in the second column
// on the dashboard.  This is how a staff member will manually check-in a client.
class ManualOrder extends Component {
  // Setting state here for when a staff member would need to manually check-in a client.
  state = {
    [locationID]: "",
    [householdID]: "",
    [dietaryRestrictions]: "",
    [walkingHome]: false,
    [pregnant]: false,
    [childBirthday]: false,
    [snap]: false,
    [other]: "",
    [pickupName]: "",
    [waitTimeMinutes]: "15",

    [clientName]: "",
    [showPersonPickupTextBox]: false,
    [autoFilledInfo]: false
  };

  seeIfUserIsValid = (name, householdID) => {
    this.props.dispatch({
      type: requests.staffSearchForClientInfo,
      payload: {
        name: name,
        householdID: householdID
      }
    });
  }

  clear = () => {
    this.props.toggleShowClientInfo();
    this.resetState(true);
    this.props.dispatch({ type: dispatches.staff.clearSearchResultClientInfo });
  }

  resetState = (resetSearchInfo) => {
    this.setState({
      [dietaryRestrictions]: "",
      [walkingHome]: false,
      [pregnant]: false,
      [childBirthday]: false,
      [snap]: false,
      [other]: "",
      [pickupName]: "",
      [waitTimeMinutes]: "15",

      [showPersonPickupTextBox]: false,
      [autoFilledInfo]: false
    });
    resetSearchInfo && this.setState({
      [locationID]: "",
      [clientName]: "",
      [householdID]: "",
    });
  }

  componentDidUpdate() {
    const clientInfo = this.props.clientInfo;
    // If client info was found autofill the form.
    if (clientInfo[database.profile.latest_order] && this.state[autoFilledInfo] === false) {
      this.setState({
        [dietaryRestrictions]: clientInfo.latest_order[database.order.dietary_restrictions],
        [walkingHome]: clientInfo.latest_order[database.order.walking_home],
        [pregnant]: clientInfo.latest_order[database.order.pregnant],
        [childBirthday]: clientInfo.latest_order[database.order.child_birthday],
        [snap]: clientInfo.latest_order[database.order.snap],
        [other]: clientInfo.latest_order[database.order.other],
        [pickupName]: clientInfo.latest_order[database.order.pickup_name],

        [showPersonPickupTextBox]: Boolean(clientInfo.latest_order[database.order.pickup_name]),
        [autoFilledInfo]: true
      })
      // Clear the auto filled info.
    } else if (!clientInfo[id] && this.state[autoFilledInfo] === true) {
      this.resetState(false);
    }
  }

  render() {
    return (
      <>
        <Container id="checkInContainer">
          <Row id="clientInfoRow">
            <div id="secondColManualHeader">
              <h1 id="secondColManualTitle">Manually check in a client.
                <br />
                {this.props.staffGetClientIsLoading ?
                  <><CircularProgress style={{ color: '#18bc3c' }} /><>Searching...</></>
                  : this.props.clientInfo[database.account.active] === false || this.props.clientInfo[database.account.approved] === false ?
                    <><ErrorIcon style={{ color: '#d31f1f', fontSize: 62 }} className='iconExplanationText' /><>Client can't place orders.</></>
                    : this.props.clientInfo[database.account.id] ?
                      <><CheckCircleOutlineIcon style={{ color: '#18bc3c', fontSize: 62 }} className='iconExplanationText' /><>That's a valid client!</></>
                      : <><ErrorIcon style={{ color: '#ffe100', fontSize: 62 }} className='iconExplanationText' /><>Client not found.</></>
                }
              </h1>
              <button
                id="cancelButton"
                className="btn btn-large btn-primary"
                onClick={() => {
                  this.clear();
                }}
              >
                Cancel
              </button>
            </div>
          </Row>
          {/* This is the exact same information as what is included in the CheckIn component. */}
          <Form.Row xs={12}>
            <>
              <div id="clientQuestions">
                <p className="mt-2 mb-0"><i>Check all that are true</i></p>
                <label id="idManualLabel" htmlFor="houseHoldIdManual">
                  Enter Household ID:
                  <br></br>
                  <input
                    type="text"
                    name="houseHoldIdManual"
                    id="houseHoldIdInput"
                    value={this.state[householdID]}
                    onChange={(event) => {
                      this.setState({ [householdID]: event.target.value })
                      this.seeIfUserIsValid(this.state[clientName], event.target.value);
                    }}
                  />
                </label>
                <br></br>
                <label>
                  Enter the client's name:
                  <br></br>
                  <input
                    type="text"
                    name="houseHoldIdManual"
                    id="houseHoldIdInput"
                    value={this.state.clientName}
                    onChange={(event) => {
                      this.setState({ clientName: event.target.value });
                      this.seeIfUserIsValid(event.target.value, this.state.householdID);
                    }}
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
                        <option value=""></option>
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
                <label htmlFor="showTextArea" className="checkboxLabel">
                  Is there another person picking up the order?
                    <input
                    type="checkbox"
                    className="check"
                    checked={this.state.showPersonPickupTextBox}
                    onChange={() => {
                      this.setState({
                        showPersonPickupTextBox: !this.state.showPersonPickupTextBox,
                      });
                      !this.state.showPersonPickupTextBox &&
                        this.setState({ [pickupName]: "" });
                    }}
                  />
                </label>
                <br />
                {this.state.showPersonPickupTextBox && (
                  <>
                    <label htmlFor="pickup_name" id="nameLabel">
                      Please enter the name here:
                      <br />
                      <textarea
                        rows="1"
                        cols="40"
                        name="name"
                        value={this.state[pickupName]}
                        onChange={(event) =>
                          this.setState({
                            [pickupName]: event.target.value,
                          })
                        }
                        placeholder="Name of person picking up"
                      ></textarea>
                    </label>
                    <br></br>
                  </>
                )}
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
                  Are they walking home?
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
                  Is a woman in your home pregnant and need prenatal vitamins?
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
                  Are they currently receiving SNAP?
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
                <label htmlFor="nameLabel" className="checkboxLabel">
                  Please choose a wait time:
                  <select
                    value={this.state[waitTimeMinutes]}
                    onChange={(event) =>
                      this.setState({
                        [waitTimeMinutes]: event.target.value,
                      })
                    }
                  >
                    <>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </>
                  </select>
                </label>
                {/* On submit of the form, we dispatch to "SUBMIT_ORDER" with a payload of 
                all the new state set by the staff input.  Then the
                manual order is complete.  And we can show the client info again.*/}
                <button
                  id="submitButtonManual"
                  disabled={
                    !this.state.householdID ||
                    !Boolean(this.state.clientName) ||
                    !Boolean(this.state.locationID) ||
                    !Boolean(this.state.waitTimeMinutes) ||
                    !Boolean(this.props.clientInfo[database.account.id]) ||
                    this.props.clientInfo[database.account.active] === false ||
                    this.props.clientInfo[database.account.approved] === false
                  }
                  onClick={() => {
                    this.props.dispatch({
                      type: "SUBMIT_ORDER",
                      payload: {
                        household_id: this.state[householdID],
                        client_name: this.state.clientName,
                        location_id: this.state.locationID,
                        dietary_restrictions: this.state.dietaryRestrictions,
                        walking_home: this.state.walkingHome,
                        pregnant: this.state.pregnant,
                        child_birthday: this.state.childBirthday,
                        snap: this.state.snap,
                        pickup_name: this.state[pickupName],
                        other: this.state.other,
                        wait_time_minutes: this.state.waitTimeMinutes,
                      },
                    });
                    this.clear();
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

const mapStateToProps = (globalState) => ({
  parkingLocations: globalState.parkingLocations,
  clientInfo: globalState.staff[state.staff.searchResultClientInfo],
  staffGetClientIsLoading: globalState.loading[state.loading.staffGetClientIsLoading]
});

export default connect(mapStateToProps)(ManualOrder);

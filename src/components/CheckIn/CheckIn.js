import React from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import "./CheckIn.css";

class CheckIn extends React.Component {
  state = {
    locationID: '',
    dietaryRestrictions: "",
    walkingHome: false,
    pregnant: false,
    childBirthday: false,
    showCheckIn: true,
    showQuestions: false,
    showSuccess: false
  };

  render() {
    console.log(this.state);
    return (
      <>
        <Container>
          <Row id="clientInfoRow">
            <div id="clientInfo">
              <h1>{this.props.account.name}</h1>
              <h3>This will be the household id</h3>
              <h3>This will be the last check-in date</h3>
            </div>
          </Row>
          <Row>
            {this.state.showCheckIn && (
              <div id="clientInput">
                <form>
                  <label htmlFor="name" id="parkingLabel">
                    Please enter parking spot number:
                    <br></br>
                    <input
                      type="text"
                      name="parking"
                      value={this.state.locationID}
                      id="parkingNumber"
                      onChange={(event) =>
                        this.setState({ locationID: event.target.value })
                      }
                    />
                    <br></br>
                    <input
                      type="button"
                      name="submit"
                      value="Check-In"
                      id="checkInButton"
                      disabled={!Boolean(this.state.locationID)}
                      onClick={() =>
                        this.setState({
                          showQuestions: true,
                          showCheckIn: false,
                        })
                      }
                    />
                  </label>
                </form>
              </div>
            )}
          </Row>
          {this.state.showQuestions && (
            <>
              <div id="clientQuestions">
                <label htmlFor="foodRestrictions">
                  Please list any food restrictions here:
                  <br></br>
                  <textarea
                    rows="4"
                    cols="30"
                    name="foodRestrictions"
                    value={this.state.dietaryRestrictions}
                    onChange={(event) =>
                      this.setState({ dietaryRestrictions: event.target.value })
                    }
                    placeholder="Example: Dairy, peanuts"
                  ></textarea>
                </label>
                <br></br>
                <label htmlFor="walking">
                  Are you walking home?
                  <input
                    type="checkbox"
                    id="walkingHomeYes"
                    name="walkingHome"
                    checked={this.state.walkingHome}
                    onChange={() =>
                      this.setState({ walkingHome: !this.state.walkingHome })
                    }
                  />
                </label>
                <br></br>
                <label htmlFor="birthday">
                  Is there a child in the household with a birthday in the next
                  2 months?
                  <input
                    type="checkbox"
                    id="childBirthdayYes"
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
                <label htmlFor="pregnant">
                  Is there a woman in the household who is pregnant?
                  <input
                    type="checkbox"
                    id="pregnant"
                    name="pregnant"
                    checked={this.state.pregnant}
                    onChange={() =>
                      this.setState({ pregnant: !this.state.pregnant })
                    }
                  />
                </label>
              </div>
              <button
                onClick={() => {
                  this.props.dispatch({
                    type: "SUBMIT_ORDER",
                    payload: {
                      parking: "",
                      location_id: this.state.locationID,
                      dietary_restrictions: this.state.dietaryRestrictions,
                      walking_home: this.state.walkingHome,
                      pregnant: this.state.pregnant,
                      child_birthday: this.state.childBirthday,
                    },
                  });
                  this.setState({ showSuccess: true, showQuestions: false });
                }}
              >
                Submit
              </button>
            </>
          )}
          {this.state.showSuccess && (
            <div id="clientInput">
              <form>
                <label htmlFor="name">Success!</label>
              </form>
            </div>
          )}
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps)(CheckIn);

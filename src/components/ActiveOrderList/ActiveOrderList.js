import React, { Component } from "react";
import {connect} from "react-redux";

class ActiveOrderList extends Component {

	componentDidMount = () => {
		this.props.dispatch({type: "FETCH_ACTIVE_ORDERS"});
		const interval = setInterval(() => this.props.dispatch({type: "FETCH_ACTIVE_ORDERS"}), 10*1000);
		this.setState({refreshInterval: interval});
	}

	componentWillUnmount = () => {
		clearInterval(this.state.refreshInterval);
	}
  

  render() {
    return (
          <div className="span6">
            <form>
              <ul>
                {this.props.activeOrders?.map((cur, i) => (
									<li>
										{cur.account_id}
									</li>
								))}
              </ul>
              <br />
              <button className="btn btn-large btn-primary" type="submit">
                  Add Client
                </button>
            </form>
          </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeOrders: state.activeOrders,
  completeOrders: state.completeOrders,
});

export default connect(mapStateToProps)(Dashboard);
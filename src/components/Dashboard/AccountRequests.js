import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from 'mui-datatables';
import TablePresets from '../Table/TableDefaults';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import "./Dashboard.css";
import "./AccountRequests.css";

const useStyles = createMuiTheme(
  TablePresets.theme
);

class PendingAccounts extends Component {
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
    const data = this.props.pendingAccounts.map(accountObj =>
      [accountObj.name, accountObj.email, accountObj.household_id]
    );
    const columns = TablePresets.columns;
    // If there's the default quantity of three columns add another one for updating accounts
    // because every time the pages updates it will try to add another column.
    if (columns.length === 3) {
      columns.push(
        {
          name: 'Update',
          options: {
            filter: true,
            sort: false,
            empty: true,
            customBodyRenderLite: (dataIndex) => {
              return (
                <>
                  <button
                    className={'acceptButton'}
                    onClick={() => {
                      this.props.dispatch({
                        type: 'UPDATE_PENDING_ACCOUNT',
                        payload: { id: this.props.pendingAccounts[dataIndex].id, approved: true }
                      })
                    }}>
                    Accept
                </button>
                  <button
                    className={'declineButton'}
                    onClick={() => {
                      this.props.dispatch({
                        type: 'UPDATE_PENDING_ACCOUNT',
                        payload: { id: this.props.pendingAccounts[dataIndex].id, approved: false }
                      })
                    }}>
                    Decline
                </button>
                </>
              );
            }
          }
        }
      )
    }
    return (
      <>
        <h5>If any of this information needs to be modified please speak with an administrator.</h5>
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Pending Accounts' data={data} columns={TablePresets.columns} options={TablePresets.options} />
        </MuiThemeProvider>
      </>
    );
  }
}


const mapStateToProps = (state) => ({
  pendingAccounts: state.pendingAccounts
});

export default connect(mapStateToProps)(PendingAccounts);

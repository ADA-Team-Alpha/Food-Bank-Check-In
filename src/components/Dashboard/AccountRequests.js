import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from 'mui-datatables';
import TablePresets from '../Table/TableDefaults';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import "./Dashboard.css";

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
    console.log(data);
    return (
      <>
        <MuiThemeProvider theme={useStyles}>
          <MUIDataTable title='Search Page' data={data} columns={TablePresets.columns} options={TablePresets.options} />
        </MuiThemeProvider>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  pendingAccounts: state.pendingAccounts
});

export default connect(mapStateToProps)(PendingAccounts);

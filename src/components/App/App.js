import React, { Component } from 'react';
import './App.css';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import RegisterPage from '../RegisterPage/RegisterPage';
import LoginPage from '../LoginPage/LoginPage';
import Header from '../Header/Header';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Dashboard from '../Dashboard/Dashboard';
import CheckIn from '../CheckIn/CheckIn';

// The App file contains the two main components, Dashboard and CheckIn
// as well as the register/login routes

// On componentDidMount, 'FETCH_INFO' is dispatched to grab information about the account that is logged in.
class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_INFO' });
  }

  render() {
    return !this.props.loading ? (
      <Router>
        <div>
          <Header />
          <Switch>
            {/* Access level 1 is a client, access level 10 or higher is staff
                Route redirecting is based on the access level */}
            {/* If the user is logged in, they will be taken to the correct route (checkin for clients, dashboard for staff) */}
            {this.props.account.access_level === 1 ? (
              <Redirect exact from="/login" to="/checkin" />
            ) : this.props.account.access_level >= 10 ? (
              <Redirect exact from="/login" to="/dashboard" />
            ) : (
              <Redirect exact from="/" to="/login" />
            )}
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/register">
              <RegisterPage />
            </Route>
            {/* For protected routes, the view could show one of several things on the same route.
              If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page. */}
            <ProtectedRoute
              exact
              path="/checkin"
              component={CheckIn}
              maximumAccessLevel={1}
            />
            <ProtectedRoute
              exact
              path="/dashboard"
              component={Dashboard}
              minimumAccessLevel={10}
            />
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
        </div>
      </Router>
    ) : (
      <Router>
        <Header />
      </Router>
    );
  }
}

// Bringing in accountReducer to compare access level
const mapStateToProps = (state) => ({
  account: state.account,
  loading: state.loading
});

export default connect(mapStateToProps)(App);

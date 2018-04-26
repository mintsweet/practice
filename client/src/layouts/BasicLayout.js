import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import GlobalNav from '../components/GlobalNav';
import { getUserInfo } from '@/store/user.reducer';
// router
import routerData from '../common/router';

const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      <route.component {...props} routes={route.routes} />
    )}
  />
);

class BasicLayout extends PureComponent {
  state = {
    login: true
  };

  componentDidMount() {
    if (!this.props.user.info) {
      this.getUserInfo();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.info) {
      this.setState({
        login: false
      });
    }
  }

  async getUserInfo() {
    const res = await this.props.getUserInfo();
  }

  render() {
    const { login } = this.state;
    const home = (
      <Fragment>
        <Switch>
            {routerData.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </Switch>
        <GlobalNav />
      </Fragment>
    );

    return (
      <div className="container">
        {login ? home : <Redirect to="/user" />}
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  { getUserInfo }
)(BasicLayout);
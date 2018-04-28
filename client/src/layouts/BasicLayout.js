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

export default class BasicLayout extends PureComponent {
  render() {
    return (
      <div className="container">
        <Switch>
            {routerData.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </Switch>
        <GlobalNav />
      </div>
    );
  }
}

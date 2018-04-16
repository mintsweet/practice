import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/user" component={UserLayout} />
        <Route path="/" component={BasicLayout} />
      </Switch>
    </Router>
  );
};
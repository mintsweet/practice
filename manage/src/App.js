import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';
import { getLocal } from './utils/local';
import store from './store';

const Authorized = () => {
  const auth = getLocal('token');
  return auth ? <BasicLayout /> : <Redirect to="/user" />;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/" component={Authorized} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;

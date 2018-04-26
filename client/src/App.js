import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import store from '@/store';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import { testApi } from '@/service/api';

export default class App extends Component {
  state = {
    error: false
  };

  componentDidMount() {
    testApi()
      .then(res => {
        this.setState({
          error: false
        });
      })
      .catch(err => {
        this.setState({
          error: true
        });
      })
  }

  render() {
    const { error } = this.state;

    const content = error
      ? (<div className="serveError">尚未连接服务器</div>)
      : (
        <Router>
          <Switch>
            <Route path="/user" component={UserLayout} />
            <Route path="/" component={BasicLayout} />
          </Switch>
        </Router>
      );

    return (
      <Provider store={store}>
        {content}
      </Provider>
    );
  }
}

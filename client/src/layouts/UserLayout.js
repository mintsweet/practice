import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styles from './UserLayout.module.css';
import Signin from '../routes/user/signin';
import Signup from '../routes/user/signup';
import Forget from '../routes/user/forget';

export default class UserLayout extends PureComponent {
  render() {
    return (
      <div className="container">
        <div className={styles.logo}>
          <span>Logo</span>
        </div>
        <Switch>
          <Redirect from="/user" to="/user/signin" />
          {/* <Route path="/user" render={() => } /> */}
          <Route path="/user/signin" component={Signin} />
          <Route path="/user/signup" component={Signup} />
          <Route path="/user/forget" component={Forget} />
        </Switch>
      </div>
    );
  }
}

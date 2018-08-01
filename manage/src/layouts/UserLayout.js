import React, { PureComponent, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import Login from '../routes/user/Login';
import ForgetPass from '../routes/user/ForgetPass';
import styles from './UserLayout.scss';
import logo from '../assets/logo.png';

const links = [
  {
    key: 'souces',
    title: '源码',
    href: 'https://github.com/mintsweet/practice',
    blankTarget: true
  },
  {
    key: 'blog',
    title: '博客',
    href: 'https://github.com/mintsweet/blog',
    blankTarget: true
  }
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 青湛(Github/mintsweet)
  </Fragment>
);

export default class UserLayout extends PureComponent {
  render() {
    return (
      <DocumentTitle title="登录 - Mints(后台管理系统)">
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Mints Community</span>
              </Link>
              <div className={styles.desc}>Mints - 后台管理系统</div>
            </div>
            <Switch>
              <Route exact path="/user" component={() => <Redirect to="/user/login" />} />
              <Route path="/user/login" component={Login} />
              <Route path="/user/forget_pass" component={ForgetPass} />
            </Switch>
            <GlobalFooter links={links} copyright={copyright} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
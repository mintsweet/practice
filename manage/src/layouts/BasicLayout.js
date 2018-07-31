import React, { PureComponent, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Layout, Icon } from 'antd';
import SiderMenu from '../components/SiderMenu';
import GlobalFooter from '../components/GlobalFooter';
import GlobalHeader from '../components/GlobalHeader';
import { getMenuData } from '../utils/menu';
import routerData from '../utils/router';
import logo from '../assets/logo.png';

const { Header, Content, Footer } = Layout;

const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      <route.component {...props} routes={route.routes} />
    )}
  />
);

const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

@withRouter
export default class BasicLayout extends PureComponent {
  state = {
    collapsed: false
  };

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  getPageTitle = () => {
    const { location: { pathname } } = this.props;
    let title = 'Minst(后台管理系统)';
    const pageName = routerData.find(item => item.path === pathname);
    if (pageName) title = `${pageName.name} - ${title}`;
    return title;
  }

  render() {
    const { collapsed } = this.state;

    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          collapsed={collapsed}
          menuData={getMenuData()}
        />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <GlobalHeader
              collapsed={collapsed}
              onCollapse={this.handleMenuCollapse}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Switch>
              {routerData.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
              <Route component={NoMatch} />
            </Switch>
          </Content>
          <Footer>
            <GlobalFooter
              links={[
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
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2018 青湛(Github/mintsweet)
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    );
  }
}
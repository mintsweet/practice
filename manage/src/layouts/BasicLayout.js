import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { Layout, Icon, message } from 'antd';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import SiderMenu from '@/components/SiderMenu';
import GlobalFooter from '@/components/GlobalFooter';
import GlobalHeader from '@/components/GlobalHeader';
import { getMenuData } from '@/utils/menu';
import routerData from '@/utils/router';
import { saveUserFunc, signoutFunc } from '@/store/user.reducer';
import logo from '../assets/logo.png';

const { Header, Content, Footer } = Layout;

// 路由生成器
const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      <route.component {...props} routes={route.routes} />
    )}
  />
);

// 404
const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

// 面包屑映射
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  for (const i of menuData) {
    const item = routerData.find(item => item.path === i.path);
    if (item) {
      result[i.path] = item.name;
    }

    if (i.children) {
      Object.assign(result, getBreadcrumbNameMap(i.children, routerData));
    }
  }

  return result;
}

// 响应式间距
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

@withRouter
@connect(
  ({ user }) => ({
    user: user.info,
    token: user.token
  }),
  { saveUserFunc, signoutFunc }
)
export default class BasicLayout extends PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    collapsed: false,
    isMobile
  };

  getChildContext() {
    const { location } = this.props;

    console.log(getBreadcrumbNameMap(getMenuData(), routerData))

    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData)
    }
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });

    const { token, user } = this.props;
    
    if (token) {
      if (!user) this.props.saveUserFunc(token);
    } else {
      this.props.history.push('/user');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { token } = nextProps;
    if (!token) {
      this.props.history.push('/user');
    }
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  // 控制右侧菜单收缩
  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  // 控制用户菜单
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.signoutFunc();
      message.success('退出成功');
      this.props.history.push('/user');
    }
  }

  // 设置页面标题
  getPageTitle = () => {
    const { location: { pathname } } = this.props;
    let title = 'Minst(后台管理系统)';
    const pageName = routerData.find(item => item.path === pathname);
    if (pageName) title = `${pageName.name} - ${title}`;
    return title;
  }

  render() {
    const { collapsed } = this.state;
    const { user, location } = this.props;
    const { isMobile: mb } = this.state;

    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          isMobile={mb}
          collapsed={collapsed}
          location={location}
          menuData={getMenuData()}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <GlobalHeader
              logo={logo}
              user={user}
              isMobile={mb}
              collapsed={collapsed}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{ padding: 24 }}>
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
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}
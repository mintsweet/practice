import * as React from 'react';
import Link from 'umi/link';
import { Layout, Icon, LocaleProvider, Breadcrumb } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { connect } from 'dva';
import menuData from '../menu';
import GlobalHeader from '../components/Header';
import GlobalFooter from '../components/Footer';
import SiderMenu from '../components/SiderMenu';
import styles from './basic.less';
import logo from '../assets/logo.png';

const { Header, Footer, Content } = Layout;
const { Item: BreadcrumbItem } = Breadcrumb;

// 面包屑映射
const getBreadcrumbNameMap = (menuData) => {
  const result = {
    '/': '首页',
  };

  for (const i of menuData) {
    result[i.path] = i.name;

    if (i.children) {
      Object.assign(result, getBreadcrumbNameMap(i.children));
    }
  }

  return result;
}

interface Props {
  user?: object;
  collapsed?: boolean;
  location?: any;
  dispatch?: ({}) => void;
}

@connect(({ app }) => ({
  collapsed: app.collapsed,
  token: app.token,
  user: app.user,
}))
export default class BasicLayout extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.dispatch({ type: 'app/getUser' });
  }

  getBreadcrumbDom = () => {
    const breadcrumbMap = getBreadcrumbNameMap(menuData);
    const { location } = this.props;
    const urlList = location.pathname.split('/').filter(i => i);
    const pathSnippets = urlList.map((_, i) => {
      return `/${urlList.slice(0, i + 1).join('/')}`;
    });

    pathSnippets.unshift('/');

    const extraBreadcrumbItems = pathSnippets.map(url => {
      return (
        <BreadcrumbItem key={url}>
          <Link to={url} replace>{breadcrumbMap[url]}</Link>
        </BreadcrumbItem>
      );
    });

    return extraBreadcrumbItems;
  }

  handleCollapse = () => {
    this.props.dispatch({ type: 'app/updateCollapsed' });
  }

  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({ type: 'app/signout' });
    }
  }

  render() {
    const { children, user, collapsed, location } = this.props;

    const layout = (
      <Layout style={{ height: '100%', }}>
        <SiderMenu
          logo={logo}
          collapsed={collapsed}
          menus={menuData}
          location={location}
        />
        <Layout>
          <Header style={{ background: '#fff', padding: 0, }}>
            <GlobalHeader
              user={user}
              collapsed={collapsed}
              onCollapse={this.handleCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{ margin: 24, }}>
            <Breadcrumb className={styles.breadcrumb}>{this.getBreadcrumbDom()}</Breadcrumb>
            <div className={styles.content}>{children}</div>
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
                <>
                  Copyright <Icon type="copyright" /> 2018 - 2019 青湛(GitHub/mintsweet)
                </>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <LocaleProvider locale={zh_CN}>
        {layout}
      </LocaleProvider>
    );
  }
}

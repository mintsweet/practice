import * as React from 'react';
import { Layout, Icon } from 'antd';
import { connect } from 'dva';
import GlobalHeader from '../components/Header';
import GlobalFooter from '../components/Footer';
import SiderMenu from '../components/SiderMenu';

const { Header, Footer, Content } = Layout;

interface Props {
  user?: object;
  collapsed?: boolean;
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

  handleCollapse = () => {
    this.props.dispatch({ type: 'app/updateCollapsed' });
  }

  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({ type: 'app/signout' });
    }
  }

  render() {
    const { children, user, collapsed } = this.props;

    const layout = (
      <Layout style={{ height: '100%', }}>
        <SiderMenu
          collapsed={collapsed}
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
          <Content style={{ margin: 24, }}>{children}</Content>
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
      <div style={{ height: '100%', }}>
        {layout}
      </div>
    );
  }
}

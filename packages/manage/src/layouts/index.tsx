import * as React from 'react';
import { Layout, Icon } from 'antd';
import { connect } from 'dva';
import GlobalHeader from '../components/Header';
import GlobalFooter from '../components/Footer';
import SiderMenu from '../components/SiderMenu';

const { Header, Footer, Content } = Layout;

interface Props {
  collapsed: boolean;
  dispatch?: ({}) => void;
}

@connect(({ app }) => ({
  collapsed: app.collapsed
}))
export default class BasicLayout extends React.PureComponent<Props> {
  handleCollapse = () => {
    this.props.dispatch({
      type: 'app/updateCollapsed'
    });
  }

  render() {
    const { children, collapsed } = this.props;

    const layout = (
      <Layout style={{ height: '100%', }}>
        <SiderMenu
          collapsed={collapsed}
        />
        <Layout>
          <Header style={{ background: '#fff', padding: 0, }}>
            <GlobalHeader
              collapsed={collapsed}
              onCollapse={this.handleCollapse}
            />
          </Header>
          <Content>{children}</Content>
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

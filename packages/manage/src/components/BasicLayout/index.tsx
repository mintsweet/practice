import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import routes from '@/router';
import globalStore from '@/store/global';
import userStore from '@/store/user';
import SiderMenu, { SiderMenuItem } from './SiderMenu';
import CustomHeader from './Header';
import CustomFooter from './Footer';
import styles from './index.module.less';

const { Header, Content, Footer } = Layout;

interface Props {
  children: React.ReactNode;
}

const getBreadcrumbNameMap = (menuData: SiderMenuItem[]) => {
  const result: { [key: string]: string } = {};

  for (const i of menuData) {
    result[i.path] = i.title;

    if (i.routes) {
      Object.assign(result, getBreadcrumbNameMap(i.routes));
    }
  }

  return result;
};

export default function BasicLayout({ children }: Props) {
  const { pathname } = useLocation();
  const collapsed = globalStore.useState('collapsed');

  const handleCollapse = () => {
    globalStore.dispatch('changeCollapsed', {
      collapsed: !collapsed,
    });
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      userStore.dispatch('logout');
    }
  };

  const getBreadcrumb = () => {
    const breadcrumbMap = getBreadcrumbNameMap(routes);
    const urlList = pathname.split('/').filter(i => i);
    const pathSnippets = urlList.map(
      (_, i) => `/${urlList.slice(0, i + 1).join('/')}`,
    );

    pathSnippets.unshift('/');

    const extraBreadcrumbItems = pathSnippets.map((url, i, arr) => {
      if (i === arr.length - 1) {
        return (
          <Breadcrumb.Item key={url}>{breadcrumbMap[url]}</Breadcrumb.Item>
        );
      }

      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbMap[url]}</Link>
        </Breadcrumb.Item>
      );
    });

    return extraBreadcrumbItems;
  };

  return (
    <Layout style={{ height: '100%' }}>
      <SiderMenu collapsed={collapsed} menus={routes} />
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <CustomHeader
            collapsed={collapsed}
            onCollapse={handleCollapse}
            onMenuClick={handleMenuClick}
          />
        </Header>
        <Content style={{ margin: 24 }}>
          <Breadcrumb className={styles.breadcrumb}>
            {getBreadcrumb()}
          </Breadcrumb>
          <div className={styles.content}>{children}</div>
        </Content>
        <Footer>
          <CustomFooter
            links={[
              {
                key: 'souces',
                title: '源码',
                href: 'https://github.com/mintsweet/practice',
                blankTarget: true,
              },
              {
                key: 'blog',
                title: '博客',
                href: 'https://github.com/mintsweet/blog',
                blankTarget: true,
              },
            ]}
            copyright={
              <>
                Copyright <CopyrightOutlined /> 2018 - 2021
                青湛(GitHub/mintsweet)
              </>
            }
          />
        </Footer>
      </Layout>
    </Layout>
  );
}

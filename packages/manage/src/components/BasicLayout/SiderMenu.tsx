import React, { useState, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { pathToRegexp } from 'path-to-regexp';
import logo from '@/assets/logo.png';
import styles from './index.module.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

export interface SiderMenuItem {
  path: string;
  title: string;
  hidden?: boolean;
  redirect?: string;
  icon?: React.ReactNode;
  routes?: SiderMenuItem[];
}

interface Props {
  collapsed: boolean;
  menus: SiderMenuItem[];
}

const getFlatMenuKeys = (data: SiderMenuItem[]) => {
  let keys: string[] = [];
  data.forEach(item => {
    keys.push(item.path);
    if (item.routes) {
      keys = keys.concat(getFlatMenuKeys(item.routes));
    }
  });
  return keys;
};

const getSubMenuOrItem = (item: SiderMenuItem): React.ReactNode => {
  if (item.routes && item.routes.some(child => child.title)) {
    const childrenItems = getNavMenuItems(item.routes);
    if (childrenItems && childrenItems.length > 1) {
      const title = (
        <>
          {item.icon}
          <span>{item.title}</span>
        </>
      );

      return (
        <SubMenu title={title} key={item.path}>
          {childrenItems}
        </SubMenu>
      );
    }
    return childrenItems;
  } else {
    return (
      <Menu.Item key={item.path}>
        <Link to={item.path}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </Menu.Item>
    );
  }
};

const getNavMenuItems = (data: SiderMenuItem[]) => {
  if (!data) return [];

  return data
    .filter(item => !item.redirect && !item.hidden)
    .map(item => {
      return getSubMenuOrItem(item);
    });
};

const url2List = (url: string) => {
  const urlList = url.split('/').filter((i: string) => i);
  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`);
};

function SiderMenu({ collapsed, menus }: Props) {
  const { pathname } = useLocation();

  const flatMenuKeys = useMemo(() => getFlatMenuKeys(menus), [menus]);
  const selectedKeys = useMemo(
    () =>
      url2List(pathname).map(
        path =>
          flatMenuKeys
            .filter(item => pathToRegexp(item).test(path))
            .pop() as string,
      ),
    [flatMenuKeys, pathname],
  );

  const [openKeys, setOpenKeys] = useState(
    url2List(pathname)
      .map(
        path => flatMenuKeys.filter(item => pathToRegexp(item).test(path))[0],
      )
      .filter(i => i)
      .reduce((acc, curr) => [...acc, curr], ['/']),
  );

  const handleOpenChange = (keys: any[]) => {
    const moreThanOne =
      keys.filter(key => menus.some(item => item.path === key)).length > 1;
    setOpenKeys(moreThanOne ? [openKeys.pop()] : [...keys]);
  };

  return (
    <Sider
      breakpoint="lg"
      trigger={null}
      collapsed={collapsed}
      collapsible
      width={240}
      theme="light"
      className={styles.sider}
    >
      <div className={styles.logo} key="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
          <h1>Mints Community</h1>
        </Link>
      </div>
      <Menu
        mode="inline"
        className={styles.menu}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={handleOpenChange}
      >
        {getNavMenuItems(menus)}
      </Menu>
    </Sider>
  );
}

export default React.memo(SiderMenu);

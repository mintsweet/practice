import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import Link from 'umi/link';
import pathToRegexp from 'path-to-regexp';
import styles from './index.less';

const { Sider } = Layout;
const { Item: MenuItem, SubMenu } = Menu;

// 获得菜单的 url 列表
const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
}

// 获取各级菜单
const url2List = url => {
  const urlList = url.split('/').filter(i => i);
  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`)
}

// 获取默认展开子菜单
const getDefaultCollapsedSubMenus = (flatMenuKeys, pathname) => {
  return url2List(pathname).map(path => flatMenuKeys.filter(item => pathToRegexp(item).test(path))[0]).filter(i => i).reduce((acc, curr) => [...acc, curr], ['/']);
}


export interface Props {
  logo: any;
  collapsed: boolean;
  menus: any;
  location: any;
};

export default class SiderMenu extends React.PureComponent<Props, any> {
  private flatMenuKeys: any;

  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menus);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(this.flatMenuKeys, props.location.pathname)
    };
  }

  // 获取菜单dom
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={(
              <span>
                <Icon type={item.icon} />
                <span>{item.name}</span>
              </span>
            )}
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return (
        <MenuItem key={item.path}>
          <Link to={item.path} replace>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Link>
        </MenuItem>
      );
    }
  }

  // 获取菜单子节点
  getNavMenuItems = data => {
    if (!data) return [];

    return data
      .filter(item => item.name && !item.hidenInMenu)
      .map(item => {
        return this.getSubMenuOrItem(item);
      })
      .filter(item => item);
  }

  // 获取当前活动的菜单
  getSelectedMenuKeys = pathname => {
    return url2List(pathname).map(path => this.flatMenuKeys.filter(item => pathToRegexp(item).test(path)).pop());
  }

  // 子菜单展开
  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(key => this.props.menus.some(item => item.key === key || item.path === key)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys]
    });
  }

  render() {
    let { openKeys } = this.state;
    const { logo, collapsed, menus, location: { pathname } } = this.props;

    let selectedKeys = this.getSelectedMenuKeys(pathname);

    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    if (openKeys && !collapsed) {
      openKeys = openKeys.length === 0 ? [...selectedKeys] : openKeys;
    }

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
          onOpenChange={this.handleOpenChange}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
        >
          {this.getNavMenuItems(menus)}
        </Menu>
      </Sider>
    );
  }
}

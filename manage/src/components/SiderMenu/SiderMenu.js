import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import styles from './index.scss';

const { Sider } = Layout;
const { Item: MenuItem, SubMenu } = Menu;

export default class SiderMenu extends PureComponent {
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
          <Link to={item.path} replace={item.path == this.props.location.pathname}>
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

  render() {
    const { logo, collapsed, menuData } = this.props;

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={240}
        className={styles.sider}
        theme="light"
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>Mints Community</h1>
          </Link>
        </div>
        <Menu
          key="menu"
          mode="inline"
          className={styles.menu}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
      </Sider>
    );
  }
}
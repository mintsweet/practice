import React, { PureComponent } from 'react';
import { Icon, Dropdown, Avatar, Spin, Menu } from 'antd';
import styles from './index.scss';

const { Item: MenuItem} = Menu;

export default class GlobalHeader extends PureComponent {
  toggle = () => {
    this.props.onCollapse();
  }

  render() {
    const { collapsed, user, onMenuClick } = this.props;
    
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <MenuItem disabled>
          <Icon type="user" />个人中心
        </MenuItem>
        <MenuItem disabled>
          <Icon type="setting" />设置
        </MenuItem>
        <Menu.Divider />
        <MenuItem key="logout">
          <Icon type="logout" />退出登录
        </MenuItem>
      </Menu>
    );

    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {user ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={user.avatar} />
                <span className={styles.name}>{user.nickname}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
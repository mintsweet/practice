import * as React from 'react';
import { Icon, Menu, Dropdown, Avatar, Spin } from 'antd';
import styles from './index.less';

const { Item: MenuItem } = Menu;

export interface Props {
  user: any;
  collapsed: boolean;
  onCollapse?: () => void;
  onMenuClick?: ({}) => void;
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const { user, collapsed, onCollapse, onMenuClick } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
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
          onClick={onCollapse}
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
            <Spin size="small" style={{ marginLeft: 8, }} />
          )}
        </div>
      </div>
    );
  }
}

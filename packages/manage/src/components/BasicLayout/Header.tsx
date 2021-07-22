import React, { useMemo } from 'react';
import { Menu, Dropdown, Avatar, Spin } from 'antd';
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import userStore from '@/store/user';
import styles from './index.module.less';

const { Item: MenuItem } = Menu;

export interface Props {
  collapsed: boolean;
  onCollapse?: () => void;
  onMenuClick?: ({ key }: { key: string }) => void;
}

function Header({ collapsed, onCollapse, onMenuClick }: Props) {
  const user = userStore.useState('info');
  const menu = useMemo(
    () => (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <MenuItem key="logout">
          <LogoutOutlined />
          退出登录
        </MenuItem>
      </Menu>
    ),
    [onMenuClick],
  );

  return (
    <div className={styles.header}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: styles.trigger,
        onClick: onCollapse,
      })}
      <div className={styles.right}>
        {user ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={user.avatar}
              />
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

export default React.memo(Header);

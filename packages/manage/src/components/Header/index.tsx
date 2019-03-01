import * as React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export interface Props {
  collapsed: boolean;
  onCollapse?: () => void;
}

export default class Header extends React.PureComponent<Props> {
  toggle = () => {
    this.props.onCollapse();
  }

  render() {
    const { collapsed } = this.props;

    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
      </div>
    );
  }
}

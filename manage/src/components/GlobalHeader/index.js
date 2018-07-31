import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.scss';

export default class GlobalHeader extends PureComponent {
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
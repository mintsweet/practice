import * as React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

interface Props {
  loading: boolean;
}

export default class PageLoading extends React.PureComponent<Props> {
  render() {
    const { children, loading } = this.props;

    return (
      <div className={classNames({ [styles.loading]: loading })}>
        {loading ? <Spin tip="Loading" size="large" /> : children}
      </div>
    );
  }
}

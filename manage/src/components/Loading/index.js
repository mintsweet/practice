import React from 'react';
import classNames from 'classnames';
import { Spin } from 'antd';
import styles from './index.scss';

const Loading = (props) => {
  const { children, loading } = props;

  return (
    <div className={classNames({ [styles.loading]: loading })}>
      {loading ? <Spin tip="Loading..." size="large" /> : children}
    </div>
  );
}

export default Loading;

import React from 'react';
import { Card, Icon } from 'antd';
import CountUp from 'react-countup';
import styles from './CountCard.less';

export default ({ icon, title, count, last_count, rate, total }) => {
  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Icon type={icon} />
        <CountUp
          start={0}
          end={count}
        />
        <div className={styles.main}>
          <span>上周量<strong>{last_count}</strong></span>
          <span>周同比<strong>{rate}</strong></span>
        </div>
        <div className={styles.footer}>
          <span>总数<strong>{total}</strong>个</span>
        </div>
      </div>
    </Card>
  );
}

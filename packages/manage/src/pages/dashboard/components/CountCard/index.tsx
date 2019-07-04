import React from 'react';
import { Card, Icon } from 'antd';
import CountUp from 'react-countup';
import classNames from 'classnames';
import styles from './index.less';

export default ({ title, icon, color, count, last_count, rate, total }) => {
  const rateIsUp = rate.indexOf('-') < 0;

  return (
    <Card className={styles.statisCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Icon type={icon} style={{ color, }} className={styles.icon} />
        <CountUp
          className={styles.number}
          start={0}
          end={count}
        />
        <div className={styles.main}>
          <span>上周量<strong>{last_count}</strong></span>
          <span>周同比<strong>{rate}</strong></span>
          <Icon className={classNames(styles.icon, { [styles.up]: rateIsUp, [styles.down]: !rateIsUp })} type={rateIsUp ? 'caret-up' : 'caret-down'} />
        </div>
        <div className={styles.footer}>
          <span>总数<strong>{total}</strong>个</span>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import { Card, Icon } from 'antd';
import CountUp from 'react-countup';
import classNames from 'classnames';
import styles from './CountCard.scss';

// 计数卡片
const CountCard = props => {
  const { color, icon, title, count, last_count, rate, total } = props;
  const rateIsUp = rate.indexOf('-') < 0;

  return (
    <Card className={styles.statisCard} bodyStyle={{ padding: '20px 24px 8px' }}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        <Icon style={{ color }} className={styles.icon} style={{ color }} type={icon} />
        <CountUp
          className={styles.number}
          start={0}
          end={count}
        />
      </div>
      <div className={styles.main}>
        <span>上周量<span className={styles.rate}>{last_count}</span></span>
        <span>周同比<span className={styles.rate}>{rate}</span></span>
        <Icon className={classNames(styles.icon, { [styles.up]: rateIsUp, [styles.down]: !rateIsUp })} type={rateIsUp ? 'caret-up' : 'caret-down'} />
      </div>
      <div className={styles.footer}>
        <span>用户总数<span className={styles.total}>{total}</span>个</span>
      </div>
    </Card>
  );
}

export default CountCard;

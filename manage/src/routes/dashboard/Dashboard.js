import React, { Component } from 'react';
import { Row, Col, Card, Icon } from 'antd';
import CountUp from 'react-countup';
import classNames from 'classnames';
import Loading from '@/components/Loading';
import {
  getNewUserThisWeek, getNewUserLastWeek, getUserTotal,
  getNewTopicThisWeek, getNewTopicLastWeek, getTopicTotal
} from '@/service/api';
import styles from './Dashboard.scss';

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

export default class Dashboard extends Component {
  state = {
    loading: true,
    statisData: []
  };

  componentDidMount() {
    this.statisData();
  }

  // 获取统计数据
  statisData = async () => {
    const newUserThisWeek = await getNewUserThisWeek();
    const newUserLastWeek = await getNewUserLastWeek();
    const userTotal = await getUserTotal();
    const userRate = newUserLastWeek === 0 ? '-' : (newUserThisWeek - newUserLastWeek) / newUserLastWeek * 100 + '%';
    const newTopicThisWeek = await getNewTopicThisWeek();
    const newTopicLastWeek = await getNewTopicLastWeek();
    const topicTotal = await getTopicTotal();
    const topicRate = newTopicLastWeek === 0 ? '-' : (newTopicThisWeek - newTopicLastWeek) / newTopicLastWeek * 100 + '%';

    console.log();

    const statisData = [
      {
        title: '本周新增用户量',
        icon: 'user',
        color: '#52c41a',
        count: newUserThisWeek,
        last_count: newUserLastWeek,
        rate:  userRate,
        total: userTotal
      },
      {
        title: '本周新增话题量',
        icon: 'profile',
        color: '#fa8c16',
        count: newTopicThisWeek,
        last_count: newTopicLastWeek,
        rate: topicRate,
        total: topicTotal
      }
    ];

    this.setState({
      loading: false,
      statisData
    });
  }

  render() {
    const { loading, statisData } = this.state;

    const statis = statisData.map((item, i) => (
      <Col key={i} xs={24} sm={12} md={12} lg={12} xl={6} style={{ marginBottom: 24 }}>
        <CountCard
          {...item}
        />
      </Col>
    ));

    return (
      <Loading loading={loading}>
        <Row gutter={24}>{statis}</Row>
      </Loading>
    );
  }
}
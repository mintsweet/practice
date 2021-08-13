import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import BasicLayout from '@/components/BasicLayout';
import * as Service from './service';

const getIcon = (num: number) => {
  if (num > 0) {
    return <ArrowUpOutlined />;
  } else if (num < 0) {
    return <ArrowDownOutlined />;
  } else {
    return '-';
  }
};

const getStyle = (num: number) => {
  if (num > 0) {
    return { color: '#16982B' };
  } else if (num < 0) {
    return { color: '#dc3545' };
  } else {
    return {};
  }
};

export default function Dashboard() {
  const [curWeekAddUser, setCurWeekAddUser] = useState(0);
  const [preWeekAddUser, setPreWeekAddUser] = useState(0);
  const [userTotal, setUserTotal] = useState(0);
  const [userUpRate, setUserUpRate] = useState(0);
  const [curWeekAddTopic, setCurWeekAddTopic] = useState(0);
  const [preWeekAddTopic, setPreWeekAddTopic] = useState(0);
  const [topicTotal, setTopicTotal] = useState(0);
  const [topicUpRate, setTopicUpRate] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await Service.getDashboard();
      setCurWeekAddUser(res.curWeekAddUser);
      setPreWeekAddUser(res.preWeekAddUser);
      setUserTotal(res.preWeekAddUser);
      setUserUpRate(
        res.preWeekAddUser === 0
          ? res.curWeekAddUser
          : (res.curWeekAddUser - res.preWeekAddUser) / res.preWeekAddUser,
      );
      setCurWeekAddTopic(res.curWeekAddTopic);
      setPreWeekAddTopic(res.preWeekAddTopic);
      setTopicTotal(res.topicTotal);
      setTopicUpRate(
        res.preWeekAddTopic === 0
          ? res.curWeekAddTopic
          : (res.curWeekAddTopic - res.preWeekAddTopic) / res.preWeekAddTopic,
      );
    })();
  }, []);

  const userDash = [
    {
      title: '本周新增用户数量',
      value: curWeekAddUser,
      prefix: getIcon(curWeekAddUser),
      valueStyle: getStyle(curWeekAddUser),
    },
    {
      title: '上周新增用户数量',
      value: preWeekAddUser,
      prefix: getIcon(preWeekAddUser),
      valueStyle: getStyle(preWeekAddUser),
    },
    {
      title: '环比新增比例',
      value: userUpRate * 100,
      prefix: getIcon(userUpRate),
      valueStyle: getStyle(userUpRate),
      suffix: '%',
    },
    {
      title: '用户总数',
      value: userTotal,
    },
  ];

  const topicDash = [
    {
      title: '本周新增话题数量',
      value: curWeekAddTopic,
      prefix: getIcon(curWeekAddTopic),
      valueStyle: getStyle(curWeekAddTopic),
    },
    {
      title: '上周新增话题数量',
      value: preWeekAddTopic,
      prefix: getIcon(preWeekAddTopic),
      valueStyle: getStyle(preWeekAddTopic),
    },
    {
      title: '环比新增比例',
      value: topicUpRate * 100,
      prefix: getIcon(topicUpRate),
      valueStyle: getStyle(topicUpRate),
      suffix: '%',
    },
    {
      title: '话题总数',
      value: topicTotal,
    },
  ];

  return (
    <BasicLayout>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        {userDash.map(item => (
          <Col span={6}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                valueStyle={item.valueStyle}
                suffix={item.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        {topicDash.map(item => (
          <Col span={6}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                valueStyle={item.valueStyle}
                suffix={item.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </BasicLayout>
  );
}

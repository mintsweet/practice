import * as React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

export interface Props {
  collapsed: boolean;
};

export default class SiderMenu extends React.PureComponent<Props> {
  render() {
    const { collapsed } = this.props;

    return (
      <Sider
        breakpoint="lg"
        trigger={null}
        collapsed={collapsed}
        collapsible
        width={240}
      >

      </Sider>
    );
  }
}

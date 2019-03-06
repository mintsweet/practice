import * as React from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';

interface Props {
  token: string;
  children?: React.ReactNode;
};

@connect(({ app }) => ({
  token: app.token
}))
export default class Authorized extends React.Component<Props> {
  render() {
    const { token, children } = this.props;
    return token ? children : <Redirect to="/user/login" />;
  }
}

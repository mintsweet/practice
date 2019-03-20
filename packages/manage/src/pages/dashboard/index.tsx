import * as React from 'react';
import Link from 'umi/link';

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Link to="/content/topic">话题管理</Link>
        <br />
        <Link to="/content/user">用户管理</Link>
        <br />
        <Link to="/user/login">登录</Link>
        <br />
        <Link to="/user/forget_pass">忘记密码</Link>
      </div>
    );
  }
}

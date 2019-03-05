import * as React from 'react';
import Redirect from 'umi/redirect';

export default (props) => {
  const dom = localStorage.getItem('token') ? <Redirect to="/user/login" /> : props.chilren;
  return dom;
}

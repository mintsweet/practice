import * as React from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import GlobalFooter from '../components/Footer';
import styles from './user.less';
import logo from '../assets/logo.png';

export default (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>Mints Community</span>
          </Link>
          <div className={styles.desc}>Mints - 后台管理系统</div>
        </div>
        {props.children}
        <GlobalFooter
          links={[
            {
              key: 'souces',
              title: '源码',
              href: 'https://github.com/mintsweet/practice',
              blankTarget: true
            },
            {
              key: 'blog',
              title: '博客',
              href: 'https://github.com/mintsweet/blog',
              blankTarget: true
            }
          ]}
          copyright={
            <>
              Copyright <Icon type="copyright" /> 2018 - 2019 青湛(GitHub/mintsweet)
            </>
          }
        />
      </div>
    </div>
  );
}

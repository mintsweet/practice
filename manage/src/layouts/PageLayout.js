import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Spin } from 'antd';
import styles from './PageLayout.scss';

const { Item: BreadcrumbItem } = Breadcrumb;

@connect(
  ({ ui }) => ({
    loading: ui.loading
  })
)
export default class PageLayout extends PureComponent {
  static contextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  };

  getBreadcrumbDom = () => {
    const { location, breadcrumbNameMap } = this.context;
    const urlList = location.pathname.split('/').filter(i => i);
    const pathSnippets = urlList.map((Item, i) => {
      return `/${urlList.slice(0, i + 1).join('/')}`;
    });
    const extraBreadcrumbItems = pathSnippets.map((url, i) => {
      return (
        <BreadcrumbItem key={url}>
          <Link to={url} replace={location.pathname === url}>{breadcrumbNameMap[url]}</Link>
        </BreadcrumbItem>
      );
    });

    return extraBreadcrumbItems;
  }

  render() {
    const { children, loading } = this.props;
    const content = (
      <Fragment>
        <Breadcrumb className={styles.breadcrumb}>{this.getBreadcrumbDom()}</Breadcrumb>
        {children ? <div className={styles.content}>{children}</div> : null}
      </Fragment>
    );

    return (
      <div className={classNames({ [styles.loading]: loading })}>
        {loading ? <Spin tip="Loading..." size="large" /> : content}
      </div>
    );
  }
}

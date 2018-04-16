import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './index.module.css';

const nav = [
  {
    path: '/home',
    name: '主页'
  },
  {
    path: '/genre',
    name: '分类'
  },
  {
    path: '/add',
    name: '添加'
  },
  {
    path: '/mood',
    name: '心情'
  },
  {
    path: '/user',
    name: '个人中心'
  }
];

export default class GlobalNav extends Component {
  render() {
    return (
      <ul className={styles.globalNav}>
        {nav.map((item, i) => (
          <li key={i}>
            <NavLink to={item.path} activeClassName={styles.selected}>{item.name}</NavLink>
          </li>
        ))}
      </ul>
    );
  }
}
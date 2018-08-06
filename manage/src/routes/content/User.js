import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/global.reducer';

@connect(
  ({}) => ({}),
  { changeLoadingAction }
)
export default class User extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.changeLoadingAction(false);
    }, 3000);
  }

  render() {
    return (
      <PageLayout>
        User.
      </PageLayout>
    );
  }
}
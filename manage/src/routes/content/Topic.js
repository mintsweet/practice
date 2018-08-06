import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/reducer/ui';

@connect(
  ({}) => ({}),
  { changeLoadingAction }
)
export default class Topic extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.changeLoadingAction(false);
    }, 3000);
  }
  
  render() {
    return (
      <PageLayout>
        Topic.
      </PageLayout>
    );
  }
}
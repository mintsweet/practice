import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import PageLayout from '@/layouts/PageLayout';
import { changeLoadingAction } from '@/store/reducer/ui';
import { getTopicList } from '@/service/api';

@connect(
  ({}) => ({}),
  { changeLoadingAction }
)
export default class Topic extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const data = await getTopicList();
    this.setState({
      data
    });
    this.props.changeLoadingAction(false);
  }

  // 表格选中
  onSelectTable = (selectedRowKeys) => {
    console.log(selectedRowKeys);
  }
  
  render() {
    const { data } = this.state;

    return (
      <PageLayout>
        <div className="page-content">
          <div className="table-action">
            <Button type="primary">新增</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
}
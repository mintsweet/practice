import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { List, Carousel } from 'antd-mobile';
import { getPostList, getPostTop } from '@/store/post.reducer';

class Home extends Component {
  componentDidMount() {
    this.props.getPostTop();
    this.props.getPostList();
  }

  render() {
    const { post } = this.props;
    const { posts, tops } = post;

    return (
      <div>
        <Carousel
          autoplay={false}
          infinite
        >
          {tops.map(val => (
            <Link
              key={val}
              to={`/post/${val.id}`}
              style={{ display: 'inline-block', width: '100%', height: 176 }}
            >
              <img
                src={val.cover}
                style={{ width: '100%', verticalAlign: 'top', height: 176 }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </Link>
          ))}
        </Carousel>
        <List renderHeader={() => '文章列表'}>
          {posts.map(item => (
            <List.Item
              wrap
              key={item.id}
              arrow="horizontal"
            >
              {item.title}
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default connect(
  state => ({
    post: state.post
  }),
  { getPostList, getPostTop }
)(Home);
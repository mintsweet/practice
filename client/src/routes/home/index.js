import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';
import { connect } from 'react-redux';
import { getPostList } from '@/store/post.reducer';

class Home extends Component {
  state = {
    data: ['1', '2', '3'],
    imgHeight: 176,
  };

  componentDidMount() {
    this.props.getPostList();
  }

  render() {
    return (
      <div>
        <Carousel
          autoplay={false}
          infinite
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(val => (
            <a
              key={val}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src="http://iph.href.lu/414x176"
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default connect(
  state => ({
    post: state.post
  }),
  { getPostList }
)(Home);
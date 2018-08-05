import React, { PureComponent } from 'react';

export default class PageLayout extends PureComponent {
  state = {
    breadcrumb: null
  };

  render() {
    const { children, breadcrumb } = this.props;
    
    return (
      <div>
        {children ? <div>{children}</div> : null}
      </div>
    );
  }
}

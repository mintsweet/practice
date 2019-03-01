import * as React from 'react';

export type UserLayoutComponent<P> = React.SFC<P>;

export interface BasicLayoutProps extends React.Props<any> {}

const UserLayout : UserLayoutComponent<BasicLayoutProps> = props => {
  return (
    <div>
      <h1>账户布局</h1>
      { props.children }
    </div>
  );
};

export default UserLayout;

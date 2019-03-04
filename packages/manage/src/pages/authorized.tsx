import * as React from 'react';

export default (props) => {
  return (
    <div style={{ height: '100%', }}>
      {/* <div>PrivateRoute</div> */}
      {props.children}
    </div>
  );
}

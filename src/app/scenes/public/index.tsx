import * as React from 'react';
import Signin from './Signin';
import Signup from './signup';
import NotFound from './notfound';

class Public extends React.Component<any, any> {
  public render() {
    return (
      <div>
        Public
        {this.props.children}
      </div>
    );
  }
}

export { Public, Signin, Signup, NotFound };

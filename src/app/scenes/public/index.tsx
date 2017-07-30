import * as React from 'react';
import Signin from './Signin';
import Signup from './Signup';
import NotFound from './notfound';
import AAA from 'services/aaa';
import {browserHistory} from 'react-router';

class Public extends React.Component<any, any> {
  public render() {
    const credentials = AAA.getInstance().getCredentials();
    const hasCredentials = !!(credentials.sk && credentials.ss);

    if (hasCredentials) {
      browserHistory.push('/m/feed');
    }

    return (
      <div>
        {!hasCredentials && this.props.children}
      </div>
    );
  }
}

export {Public, Signin, Signup, NotFound};

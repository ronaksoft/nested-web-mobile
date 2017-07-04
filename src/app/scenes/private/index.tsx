import * as React from 'react';
import { Posts } from './posts';
import { Activities } from './activities';
import { Files } from './files';
import { Notifications } from './notifications';
import { Compose } from './compose';

interface IPrivateState {
    isAuthenticated: boolean;
};

class Private extends React.Component<{}, IPrivateState> {
  public constructor() {
    super();
    this.state = {
      isAuthenticated: true,
    };
  }

  public render() {
    return (
      <div>
        Private
        {this.state.isAuthenticated && this.props.children}
      </div>
    );
  }
}

export { Private, Posts, Activities, Files, Notifications, Compose };

import * as React from 'react';
import { Posts } from './posts';
import { Activities } from './activities';
import { Files } from './files';
import { Notifications } from './notifications';
import { Compose } from './compose';
import AccountApi from 'api/account';
import IUser from 'api/account/interfaces/IUser';
import {browserHistory} from 'react-router';
import AAA from 'services/aaa';

interface IPrivateState {
    isAuthenticated: boolean;
};

class Private extends React.Component<{}, IPrivateState> {
  public constructor() {
    super();
    this.state = {
      isAuthenticated: false,
    };
  }
  public componentDidMount() {
    const accountApi = new AccountApi();
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();
    const user = aaa.getUser();

    if (!credential.sk || !credential.ss) {
      aaa.setIsUnAuthenticated();
      browserHistory.push('/signin');
      return;
    }

    if (user) {
      this.setState({
        isAuthenticated: true,
      });

      return;
    }

    accountApi.recall({
      _ss: credential.ss,
      _sk: credential.sk,
    }).then((account: IUser) => {
      aaa.setUser(account);
      this.setState({
        isAuthenticated: true,
      });
    }).catch(() => {
      aaa.setIsUnAuthenticated();
      browserHistory.push('/signin');
    });

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

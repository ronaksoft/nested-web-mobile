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

class Private extends React.Component < any, any > {
  public componentDidMount() {
    const accountApi = new AccountApi();
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();
    const user = aaa.getUser();

    console.log('====================================');
    console.log(credential, user);
    console.log('====================================');

    if (!credential.sk || !credential.ss) {
      aaa.setIsUnAthenticated();
      browserHistory.push('/signin');
      return;
    }

    if (!user) {
      accountApi.recall({
        _ss: credential.ss,
        _sk: credential.sk,
      }).then((account: IUser) => {
        console.log('====================================');
        console.log(account);
        console.log('====================================');
        aaa.setUser(account);
        this.setState({
          isReady: true,
        });
      }).catch(() => {
        aaa.setIsUnAthenticated();
        browserHistory.push('/signin');
      });
    } else {
      this.setState({
        isReady: true,
      });
    }

  }

  public render() {
    return (
      <div>
        Private
        {this.props.children}
      </div>
    );
  }
}

export { Private, Posts, Activities, Files, Notifications, Compose };

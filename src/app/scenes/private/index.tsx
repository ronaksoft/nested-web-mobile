import * as React from 'react';
import {Posts} from './posts';
import {Activities} from './activities';
import {Files} from './files';
import Notifications from './notifications';
import {Compose} from './compose';
import Signout from './Signout';
import AccountApi from 'api/account';
import {IUser, IRecallResponse} from 'api/account/interfaces';
import {browserHistory} from 'react-router';
import AAA from 'services/aaa';
import {connect} from 'react-redux';
import {login, logout} from 'redux/app/actions';

interface IPrivateState {
  isLogin: boolean;
};

interface IProps {
  isLogin: boolean;
  user: IUser;
  setLogin: (user: IUser) => {};
  setLogout: () => {};
}

class Private extends React.Component<IProps, IPrivateState> {
  private accountApi: AccountApi;

  public constructor() {
    super();
    this.state = {
      isLogin: false,
    };
  }

  public componentDidMount() {

    this.accountApi = new AccountApi();
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();

    if (!credential.sk || !credential.ss) {
      aaa.clearCredentials();
      browserHistory.push('/signin');
      return;
    }

    if (this.props.isLogin && this.props.user) {
      return this.setState({
        isLogin: true,
      });
    }

    this.accountApi.recall({
      _ss: credential.ss,
      _sk: credential.sk,
    }).then((response: IRecallResponse) => {
      this.setState({
        isLogin: true,
      });
      this.props.setLogin(response.account);
    }, () => {
      aaa.clearCredentials();
      browserHistory.push('/signin');
    });

  }

  public render() {
    return (
      <div>
        Private
        {this.state.isLogin && this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
  user: store.app.user,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (user: IUser) => {
      dispatch(login(user));
    },
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Private);

export {Posts, Activities, Files, Notifications, Compose, Signout};

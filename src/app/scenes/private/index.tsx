import * as React from 'react';
import Posts from './posts';
import Notifications from './notifications';
import {Activities} from './activities';
import {Files} from './files';
import {Compose} from './compose';
import Signout from './Signout';
import Foo from './foo';
import AccountApi from 'api/account';
import {IUser, IRecallResponse} from 'api/account/interfaces';
import {browserHistory} from 'react-router';
import AAA from 'services/aaa';
import {connect} from 'react-redux';
import {login, logout, setNotificationCount} from 'redux/app/actions';
import NotificationApi from '../../api/notification/index';
import INotificationCountRequest from '../../api/notification/interfaces/INotificationCountResponse';
import {Navbar} from 'components';
import Sidebar from './sidebar/';
const style = require('./private.css');

interface IState {
  isLogin: boolean;
  sidebarOpen: boolean;
};

interface IProps {
  isLogin: boolean;
  user: IUser;
  setNotificationCount: (counts: INotificationCountRequest) => {};
  setLogin: (user: IUser) => {};
  setLogout: () => {};
}

class Private extends React.Component<IProps, IState> {
  private accountApi: AccountApi;
  private notificationApi: NotificationApi;
  private unListenChangeRoute: any;

  public constructor() {
    super();
    this.state = {
      isLogin: false,
      sidebarOpen: false,
    };
  }

  private handleAAA() {
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

  private getNotificationCounts() {
    this.notificationApi.getCount()
      .then((counts: INotificationCountRequest) => {
        this.props.setNotificationCount(counts);
      });
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
    this.notificationApi = new NotificationApi();

    this.handleAAA();
    this.getNotificationCounts();

    this.unListenChangeRoute = browserHistory.listen(() => {
      this.getNotificationCounts();
    });
  }

  public sampleF = () => {
    console.log('nothing');
    browserHistory.push('/feed');
  }

  public closeSidebar = () => {
    this.setState({
      sidebarOpen: false,
    });
  }

  public openSidebar = () => {
    this.setState({
      sidebarOpen: true,
    });
  }

  public componentWillUnmount() {
    this.unListenChangeRoute();
  }

  public render() {
    const layout = (
      <div className={style.container}>
        <Navbar sidebarOpen={this.openSidebar} composeOpen={this.sampleF}/>
        {this.props.children}
      </div>
    );
    return (
      <div>
      { this.state.sidebarOpen &&
          <Sidebar closeSidebar={this.closeSidebar}/>
        }
        { !this.state.sidebarOpen &&
          layout
        }
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
    setNotificationCount: (counts: INotificationCountRequest) => {
      dispatch(setNotificationCount(counts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Private);

export {Posts, Activities, Files, Notifications, Compose, Signout, Foo};

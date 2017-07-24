import * as React from 'react';
import Feed from './posts/feed';
import FeedByActivity from './posts/feedByActivity';
import Bookmarked from './posts/bookmarked';
import Shared from './posts/shared';
import PlacePostsAllSortedByActivity from './posts/placePostsAllSortedByActivity';
import PlacePostsAllSortedByRecent from './posts/placePostsAllSortedByRecent';
import PlacePostsUnreadSortedByRecent from './posts/placePostsUnreadSortedByRecent';
import Notifications from './notifications';
import {Activities} from './activities';
import {Files} from './files';
import Compose from './compose';
import Signout from './Signout';
import AccountApi from 'api/account';
import {IUser, IRecallResponse} from 'api/account/interfaces';
import {browserHistory} from 'react-router';
import AAA from 'services/aaa';
import {connect} from 'react-redux';
import {login, logout, setNotificationCount} from 'redux/app/actions';
import NotificationApi from '../../api/notification/index';
import INotificationCountResponse from '../../api/notification/interfaces/INotificationCountResponse';
import {Navbar} from 'components';
import Sidebar from './sidebar/';

const style = require('./private.css');

interface IState {
  isLogin: boolean;
  sidebarOpen: boolean;
  notificationsCount: number;
};

interface IProps {
  isLogin: boolean;
  user: IUser;
  setNotificationCount: (counts: INotificationCountResponse) => {};
  setLogin: (user: IUser) => {};
  setLogout: () => {};
  notificationsCount: INotificationCountResponse;
}

class Private extends React.Component<IProps, IState> {
  private accountApi: AccountApi;
  private notificationApi: NotificationApi;
  private unListenChangeRoute: any;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      isLogin: false,
      sidebarOpen: false,
      notificationsCount: this.props.notificationsCount.unread_notifications,
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      notificationsCount: newProps.notificationsCount.unread_notifications,
    });
  }

  private handleAAA() {
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();

    if (!credential.sk || !credential.ss) {
      aaa.clearCredentials();
      browserHistory.push('/m/signin');
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
      browserHistory.push('/m/signin');
    });
  }

  private getNotificationCounts() {
    this.notificationApi.getCount()
      .then((counts: INotificationCountResponse) => {
        this.props.setNotificationCount(counts);
      });
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
    this.notificationApi = new NotificationApi();

    this.handleAAA();
    this.getNotificationCounts();

    this.unListenChangeRoute = browserHistory.listen(() => {
      this.closeSidebar();
      this.getNotificationCounts();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
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

  public createLayout = () => {
    return (
      <div className={style.container}>
        <Navbar sidebarOpen={this.openSidebar} composeOpen={this.sampleF} notifCount={this.state.notificationsCount}/>
        {this.props.children}
      </div>
    );
  }

  public render() {
    const credentials = AAA.getInstance().getCredentials();
    const hasCredentials = !!(credentials.sk && credentials.ss);

    return (
      <div>
        {
          hasCredentials &&
          (
            <div>
              {this.createLayout()}
              {this.state.sidebarOpen &&
              <Sidebar closeSidebar={this.closeSidebar}/>
              }
            </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
  user: store.app.user,
  notificationsCount: store.app.notificationsCount,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (user: IUser) => {
      dispatch(login(user));
    },
    setLogout: () => {
      dispatch(logout());
    },
    setNotificationCount: (counts: INotificationCountResponse) => {
      dispatch(setNotificationCount(counts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Private);

export {
  Feed,
  FeedByActivity,
  Bookmarked,
  Shared,
  PlacePostsAllSortedByActivity,
  PlacePostsAllSortedByRecent,
  PlacePostsUnreadSortedByRecent,
  Activities,
  Files,
  Notifications,
  Compose,
  Signout
};

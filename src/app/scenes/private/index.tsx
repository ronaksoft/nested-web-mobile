/**
 * @file component/sidebar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description manage the private routes and sidebar open or close actions
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {login, logout, setNotificationCount} from 'redux/app/actions';

import Feed from './posts/feed';
import {Files} from './files';
import Compose from './compose';
import Sidebar from './sidebar/';
import {Navbar} from 'components';
import {Activities} from './activities';
import Signout from './Signout';
import FeedByActivity from './posts/feedByActivity';
import Bookmarked from './posts/bookmarked';
import Shared from './posts/shared';
import PlacePostsAllSortedByActivity from './posts/placePostsAllSortedByActivity';
import PlacePostsAllSortedByRecent from './posts/placePostsAllSortedByRecent';
import PlacePostsUnreadSortedByRecent from './posts/placePostsUnreadSortedByRecent';
import Notifications from './notifications';

import AccountApi from 'api/account';
import {IUser, IRecallResponse} from 'api/account/interfaces';
import AAA from 'services/aaa';
import NotificationApi from '../../api/notification/index';
import INotificationCountResponse from '../../api/notification/interfaces/INotificationCountResponse';

const style = require('./private.css');

/**
 * @name IState
 * @interface IState for reactive Elements
 * @type {object}
 * @property {boolean} isLogin - state of current user
 * @property {boolean} sidebarOpen - sidebar visibility state
 * @property {number} notificationsCount - counts of unreads notifications
 */
interface IState {
  isLogin: boolean;
  sidebarOpen: boolean;
  notificationsCount: number;
};

/**
 * @name IProps
 * @interface IProps for initials data
 * This interface pass the required parameters for sidebar.
 * @type {object}
 * @property {boolean} isLogin - state of current user
 * @property {IUser} user - current user object
 * @property {function} setNotificationCount - set Counts of unread notifications
 * @property {function} setLogin - athenticate user
 * @property {function} setLogout - close session of user
 * @property {INotificationCountResponse} notificationsCount - notifications unreads @link{}
 */
interface IProps {
  isLogin: boolean;
  user: IUser;
  setNotificationCount: (counts: INotificationCountResponse) => {};
  setLogin: (user: IUser) => {};
  setLogout: () => {};
  notificationsCount: INotificationCountResponse;
}

/**
 * @class Private
 * @classdesc wrapper for all private scenses also
 * checks the user authentication state
 * @extends {React.Component<IProps, IState>}
 * @requires [<IcoN>,<sortBy>,<PlaceApi>,<SidebarItem>,<InvitationItem>]
 */
class Private extends React.Component<IProps, IState> {

  /**
   * Define accountApi
   * @private
   * @type {AccountApi}
   * @memberof Private
   */
  private accountApi: AccountApi;

  /**
   * Define notificationApi
   * @private
   * @type {NotificationApi}
   * @memberof Private
   */
  private notificationApi: NotificationApi;

  /**
   * Define unListenChangeRoute
   * @private
   * @type {object}
   * @memberof Private
   */
  private unListenChangeRoute: any;

  public constructor(props: IProps) {
    super(props);

    /**
     * @default this.state
     * @type {IState}
     */
    this.state = {
      isLogin: false,
      sidebarOpen: false,
      notificationsCount: this.props.notificationsCount.unread_notifications,
    };
  }

  /**
   * Update state on changing component passed data
   * @override
   * @function componentWillReceiveProps
   * @memberof Private
   */
  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      notificationsCount: newProps.notificationsCount.unread_notifications,
    });
  }

  /**
   * handler for authentication actions
   * @override
   * @function componentWillReceiveProps
   * @memberof Private
   */
  private handleAAA() {

    /**
     * @const aaa
     * @type {object}
     */
    const aaa = AAA.getInstance();

    /**
     * @const credential
     * @type {object}
     */
    const credential = aaa.getCredentials();

    /** clear credentials in some unexpected situations */
    if (!credential.sk || !credential.ss) {
      aaa.clearCredentials();
      browserHistory.push('/m/signin');
      return;
    }

    /** determine use login state */
    if (this.props.isLogin && this.props.user) {
      return this.setState({
        isLogin: true,
      });
    }

    /**
     * recall accountApi for validate local data and
     * redirects to sign for invalid local data
     */
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

  /**
   * Get unread notifications counts from Server Api
   * and save in redux store
   * @name getNotificationCounts
   * @function
   * @private
   * @memberof Private
   */
  private getNotificationCounts() {
    this.notificationApi.getCount()
      .then((counts: INotificationCountResponse) => {
        this.props.setNotificationCount(counts);
      });
  }

  /**
   * @name componentDidMount
   * @function
   * @override
   * @private
   * @memberof Private
   */
  public componentDidMount() {

    /** Assign accountApi */
    this.accountApi = new AccountApi();

    /** Assign notificationApi */
    this.notificationApi = new NotificationApi();

     /** call the `handleAAA` to ensuring user is logged in */
    this.handleAAA();

     /** get unread notifications */
    this.getNotificationCounts();

    /**
     * calls on every route change
     * and gets unread notifications count also
     * scrolls view to the top
     * @function
     * @event
     */
    this.unListenChangeRoute = browserHistory.listen(() => {
      this.closeSidebar();
      this.getNotificationCounts();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  /**
   * navigate to feed page
   * @name sampleF
   * @function
   * @memberof Private
   * @public
   */
  public sampleF = () => {
    browserHistory.push('/m/feed');
  }

  /**
   * Close sidebar
   * @name closeSidebar
   * @function
   * @memberof Private
   * @public
   */
  public closeSidebar = () => {
    this.setState({
      sidebarOpen: false,
    });
  }

  /**
   * Open sidebar
   * @name openSidebar
   * @function
   * @memberof Private
   * @public
   */
  public openSidebar = () => {
    this.setState({
      sidebarOpen: true,
    });
  }

  /**
   * stop listening to route change
   * @name componentWillUnmount
   * @function
   * @override
   * @public
   * @memberof Private
   */
  public componentWillUnmount() {
    this.unListenChangeRoute();
  }

  /**
   * creates scenses Jsx elemnts with navbar
   * @name createLayout
   * @function
   * @public
   * @memberof Private
   */
  public createLayout = () => {
    return (
      <div className={style.container}>
        <Navbar sidebarOpen={this.openSidebar} composeOpen={this.sampleF} notifCount={this.state.notificationsCount}/>
        {this.props.children}
      </div>
    );
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {

    /**
     * @const credentials
     * @type {object}
     */
    const credentials = AAA.getInstance().getCredentials();

    /**
     * @const hasCredentials
     * @type {boolean}
     */
    const hasCredentials = !!(credentials.sk && credentials.ss);

    return (
      <div>
        {
          hasCredentials &&
          (
            <div>
              {this.createLayout()}
              {/* Sidebar elemnt with visibility state check */}
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

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
  user: store.app.user,
  notificationsCount: store.app.notificationsCount,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
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

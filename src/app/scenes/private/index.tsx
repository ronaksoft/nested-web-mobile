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
import {hashHistory} from 'react-router';
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
import FCM from '../../services/fcm/index';
import Client from 'services/utils/client';
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
  params: string;
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
  // private xStart: number;
  /**
   * Define accountApi
   * @private
   * @type {AccountApi}
   * @memberof Private
   */
  private accountApi: AccountApi;

  /**
   * @prop privatePagesWrapper
   * @desc Reference of privatePages Wrapper element
   * @private
   * @type {HTMLDivElement}
   * @memberof Private
   */
  private privatePagesWrapper: HTMLDivElement;

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

    /**
     * recall accountApi for validate local data and
     * redirects to sign for invalid local data
     */
    const recall = (deviceToken?: string) => {
      const did = Client.getDid();
      const dos = 'android';

      this.accountApi.recall({
        _ss: credential.ss,
        _sk: credential.sk,
        _dt: deviceToken,
        _did: did,
        _do: dos,
      }).then((response: IRecallResponse) => {
        Client.setDt(deviceToken);
        Client.setDid(did);
        Client.setDo(dos);
        this.setState({
          isLogin: true,
        });
        this.props.setLogin(response.account);
      }, () => {
        aaa.clearCredentials();
        hashHistory.push('/m/signin');
      });
    };

    /** clear credentials in some unexpected situations */
    if (!credential.sk || !credential.ss) {
      aaa.clearCredentials();
      hashHistory.push('/m/signin');
      return;
    }

    // Config Firebase notification
    try {
      const fcm = FCM.getInstance();
      fcm.configFCM()
        .then((deviceToken: string) => {
          console.log(deviceToken);
          recall(deviceToken);
        })
        .catch(() => {
          recall();
        });
    } catch (e) {
      recall();
    }

    /** determine use login state */
    if (this.props.isLogin && this.props.user) {
      return this.setState({
        isLogin: true,
      });
    }

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

  private scrollPreventer = (e) => {
    const isSafari = navigator.userAgent.toLowerCase().match(/(ipad|iphone)/);
    e = e || window.event;
    if (isSafari) {
      e.returnValue = false;
      e.cancelBubble = true;
      if (e.preventDefault) {
          e.preventDefault();
          e.stopPropagation();
      }
      return false; // or return e, doesn't matter
    }
  }

  /**
   * @name componentDidMount
   * @function
   * @override
   * @private
   * @memberof Private
   */
  public componentDidMount() {
    document.body.scrollTop = 0;
    document.addEventListener('scroll', this.scrollPreventer, false);
    document.addEventListener('touchmove', this.scrollPreventer, false);
    document.body.addEventListener('scroll', this.scrollPreventer, false);
    document.body.addEventListener('touchmove', this.scrollPreventer, false);

    // document.addEventListener('touchstart', (e) => {
    //   this.xStart = e.touches[0].screenY;
    // });
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
    this.unListenChangeRoute = hashHistory.listen(() => {
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
    hashHistory.push('/m/feed');
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
      <div ref={this.refHandler} className={style.container}>
        <Navbar sidebarOpen={this.openSidebar} composeOpen={this.sampleF} notifCount={this.state.notificationsCount}/>
        {this.props.children}
      </div>
    );
  }

  /**
   * @func refHandler
   * @private
   * @memberof Private
   * @param {HTMLDivElement} value
   */
  private refHandler = (value) => {
    this.privatePagesWrapper = value;
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    // if ( this.privatePagesWrapper ) {
      // this.privatePagesWrapper.addEventListener('touchmove', (e: any) => {
      //   e = e || window.event;
      //   document.body.scrollTop = 0;
      //   e.stopImmediatePropagation();
      //   e.cancelBubble = true;
      //   e.stopPropagation();
      //   const xMovement = e.touches[0].screenY - this.xStart;
      //   console.log(xMovement, this.privatePagesWrapper.scrollTop);
      //   if ( xMovement < 0 || this.privatePagesWrapper.scrollTop > 0 ) {
      //     return true;
      //   } else {
      //     e.preventDefault();
      //     e.returnValue = false;
      //     return false;
      //   }
      // }, false);
    // }
    return (
      <div>
        {
          this.state.isLogin &&
          (
            <div>
              {this.createLayout()}
              {/* Sidebar elemnt with visibility state check */}
              {this.state.sidebarOpen &&
              <Sidebar closeSidebar={this.closeSidebar} openPlace={this.props.params}/>
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
  Feed, FeedByActivity, Bookmarked, Shared, PlacePostsAllSortedByActivity,
  PlacePostsAllSortedByRecent, PlacePostsUnreadSortedByRecent, Activities, Files, Notifications, Compose,
  Signout
};

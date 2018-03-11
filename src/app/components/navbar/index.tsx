/**
 * @file component/Navbar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Navbar component. Component gets the
 *              requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {IUser} from 'api/account/interfaces';

const style = require('./navbar.css');
import {IcoN, UserAvatar} from 'components';
import {hashHistory, Link} from 'react-router';

interface INavbarProps {
  changeApp: (sts: boolean) => void;
  sidebarOpen: () => void;
  composeOpen: () => void;
  notifCount: number;
  user: IUser;
}

interface INavbarState {
  notificationOpen: boolean;
  postsApp: boolean;
  isMounted: boolean;
  notifCount: number;
  lastTaskRoute: string;
  lastPostRoute: string;
}

/**
 * Navbar component to navigate to compose, notification or sidebar
 * @class Navbar
 * @extends {React.Component<INavbarProps, INavbarState>}
 */
class Navbar extends React.Component<INavbarProps, INavbarState> {

  /**
   * Creates an instance of Navbar.
   * @constructor
   * @param {object} props - react props
   * @memberof Navbar
   */
  constructor(props: any) {
    super(props);
    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {number} notifCount the number of unseen notifications
     * @property {boolean} notificationOpen - the statement of notification scene
     */
    this.state = {
      lastTaskRoute: '/task/glance',
      lastPostRoute: '/feed',
      postsApp: true,
      isMounted: true,
      notifCount: this.props.notifCount,
      notificationOpen: false,
    };
  }

  /**
   * reaction to changes from provided data of parent
   * @param {INavbarProps} newProps
   * @memberof Navbar
   */
  public componentWillReceiveProps(newProps: INavbarProps) {
    const path = hashHistory.getCurrentLocation().pathname;
    if (this.state.postsApp && path.indexOf('task') > -1) {
      this.setState({
        postsApp: false,
      });
      this.props.changeApp(false);
    }
    if (path.indexOf('notifications') > -1) {
      this.setState({
        notificationOpen: true,
      });
    }
    /**
     * Counts of unread notifications from props
     * @type {object}
     * @property {number} notifCount the number of unseen notifications
     */
    this.setState({
      notifCount: newProps.notifCount,
    });
  }

  /**
   * Documented as Navbar.goToNotification
   * navigate user to notification scene or if already in notification scene
   * it navigates to the feed
   * @private
   * @memberof Navbar
   */
  private goToNotification() {
    if (this.state.notificationOpen) {
      hashHistory.goBack();
    } else {
      hashHistory.push('/notifications');
    }

    // update the state to new enviorment
    this.setState({
      notificationOpen: !this.state.notificationOpen,
    });
  }

  public componentWillUnmount() {
      this.setState({
        isMounted: false,
      });
  }

  private switchApp = () => {
    const thisPath = hashHistory.getCurrentLocation().pathname;
    const state: any = {
      notificationOpen: false,
    };
    if (thisPath.indexOf('notifications') === -1) {
      state.postsApp = !this.state.postsApp;
      if (state.postsApp) {
        state.lastTaskRoute = thisPath;
      } else {
        state.lastPostRoute = thisPath;
      }
      this.setState(state, () => {
        if (this.state.isMounted) {
          this.props.changeApp(state.postsApp);
          if (!this.state.postsApp) {
            hashHistory.push(this.state.lastTaskRoute);
          } else {
            hashHistory.push(this.state.lastPostRoute);
          }
        }
      });
    } else {
      if (this.state.isMounted) {
        this.setState(state, () => {
          if (!this.state.postsApp) {
            hashHistory.push(this.state.lastTaskRoute);
          } else {
            hashHistory.push(this.state.lastPostRoute);
          }
        });
      }
    }
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Navbar
   * @lends Navbar
   */
  public render() {
    return (
      <div className={style.navbar}>
        {/* open sidebar scene */}
        <a onClick={this.props.sidebarOpen}>
          <IcoN size={24} name="menu24"/>
        </a>
        {this.props.user && (
          <a>
            <UserAvatar user_id={this.props.user._id} size={24} borderRadius={'16px'}/>
          </a>
        )}
        <div className={style.filler}/>
        <div className={[style.appSwitcher, !this.state.postsApp ? style.active : style.deActive].join(' ')}
          onClick={this.switchApp}>
          <a>Posts</a>
          <small>
            <a>Tasks</a>
          </small>
        </div>
        <div className={style.filler}/>
        {/* notification scene toggler */}
        <a className={this.state.notificationOpen ? style.active : null} onClick={this.goToNotification.bind(this, '')}>
          <IcoN size={24} name="bell24"/>
          {/* red badge for unseen notifications */}
          {this.state.notifCount > 0 && <span>{this.state.notifCount}</span>}
        </a>
        {/* open compose scene */}
        <Link to="/compose">
          <IcoN size={24} name="compose24"/>
        </Link>
      </div>
    );
  }
}

export {Navbar}

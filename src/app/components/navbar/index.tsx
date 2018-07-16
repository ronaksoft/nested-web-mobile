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

const style = require('./navbar.css');
import {IcoN} from 'components';
import {hashHistory, Link} from 'react-router';

interface INavbarProps {
  changeApp: (sts: string) => void;
  sidebarOpen: () => void;
  composeOpen: () => void;
  notifCount: number;
  thisApp: string;
}

interface INavbarState {
  thisApp: string;
  isMounted: boolean;
  notifCount: number;
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
      thisApp: 'Posts',
      isMounted: true,
      notifCount: this.props.notifCount,
    };
  }

  /**
   * reaction to changes from provided data of parent
   * @param {INavbarProps} newProps
   * @memberof Navbar
   */
  public componentWillReceiveProps(newProps: INavbarProps) {

    /**
     * Counts of unread notifications from props
     * @type {object}
     * @property {number} notifCount the number of unseen notifications
     */
    this.setState({
      notifCount: newProps.notifCount,
      thisApp: newProps.thisApp,
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
    if (this.state.thisApp === 'Notifications') {
      hashHistory.goBack();
    } else {
      this.props.changeApp('Notifications');
    }
  }

  private goToSearch() {
    if (this.state.thisApp === 'Search') {
      hashHistory.goBack();
    } else {
      this.props.changeApp('Search');
    }

  }

  public componentWillUnmount() {
      this.setState({
        isMounted: false,
      });
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
        {/* <div className={[style.appSwitcher, !this.state.postsApp ? style.active : style.deActive].join(' ')}
          onClick={this.switchApp}>
          <a>Posts</a>
          <small>
            <a>Tasks</a>
          </small>
        </div> */}
        <h2>{this.state.thisApp}</h2>
        <div className={style.filler}/>
        {/* notification scene toggler */}
        <a className={this.state.thisApp === 'Search' ? style.active : null}
          onClick={this.goToSearch.bind(this, '')}>
          <IcoN size={24} name="search24"/>
        </a>
        <a className={this.state.thisApp === 'Notifications' ? style.active : null}
          onClick={this.goToNotification.bind(this, '')}>
          <IcoN size={24} name="bell24"/>
          {/* red badge for unseen notifications */}
          {this.state.notifCount > 0 && <span>{this.state.notifCount}</span>}
        </a>
        {/* open compose scene */}
        {this.state.thisApp !== 'Tasks' && (
          <Link to="/compose">
            <IcoN size={24} name="compose24"/>
          </Link>
        )}
        {this.state.thisApp === 'Tasks' && (
          <Link to="/task/create">
            <IcoN size={24} name="cross24"/>
          </Link>
        )}
      </div>
    );
  }
}

export {Navbar}

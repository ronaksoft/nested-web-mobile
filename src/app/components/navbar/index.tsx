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
import {browserHistory, Link} from 'react-router';

interface INavbarProps {
  sidebarOpen: () => void;
  composeOpen: () => void;
  notifCount: number;
}

interface INavbarState {
  notificationOpen: boolean;
  notifCount: number;
}

/**
 * Navbar component to navigate to compose, notification or sidebar
 * @class Navbar
 * @extends {React.Component<INavbarProps, INavbarState>}
 */
class Navbar extends React.Component<INavbarProps, INavbarState> {

  /**
   * constructor
   * Creates an instance of NewBadge.
   * @param {object} props
   * @memberof NewBadge
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
      notifCount: this.props.notifCount,
      notificationOpen: false,
    };
  }

  /**
   * if the parent provided data changes need to reassign the states value
   * @param {INavbarProps} newProps
   * @memberof Navbar
   */
  public componentWillReceiveProps(newProps: INavbarProps) {

    this.setState({
      notifCount: newProps.notifCount,
    });
  }

  /**
   * navigate user to notification scene or if already in notification scene
   * it navigates to the feed
   * @private
   * @memberof Navbar
   */
  private goToNotification() {
    if (this.state.notificationOpen) {
      browserHistory.push('/feed');
    } else {
      browserHistory.push('/notifications');
    }

    // update the state to new enviorment
    this.setState({
      notificationOpen: !this.state.notificationOpen,
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Navbar
   */
  public render() {
    return (
      <div className={style.navbar}>
        {/* open sidebar scene */}
        <a onClick={this.props.sidebarOpen}>
          <IcoN size={24} name="menu24"/>
        </a>
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

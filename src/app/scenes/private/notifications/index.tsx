/**
 * @auther naamsteh < naemabadei.shayesteh@gmail.com >
 * @auther sina < ehosseiniir@gmail.com >
 * Document By : robzizo
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * This file renders the notification scene.
 * Component gets the items from Api.
 */
import * as React from 'react';
import {NotificationItem} from './NotificationItem';
import NotificationApi from '../../../api/notification/index';
import {INotificationData} from '../../../api/notification/interfaces/INotificationResponse';
import INotification from 'api/notification/interfaces/INotification';
import ArrayUntiles from 'services/utils/array';
import {connect} from 'react-redux';
import {setNotification, setNotificationCount} from '../../../redux/app/actions/index';
import {Button} from 'antd';
import {IcoN} from 'components';
import INotificationCountResponse from '../../../api/notification/interfaces/INotificationCountResponse';

const style = require('./notifications.css');
const privateStyle = require('../private.css');

/**
 *
 * @implements
 * @interface IState
 */
interface IState {
  notifications: INotification[];
}

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  setNotification: (notifications: INotification[]) => {};
  notifications: INotification[];
  notificationsCount: INotificationCountResponse;
  setNotificationCount: (counts: INotificationCountResponse) => {};
}

/**
 * @class Notifications
 * @classdesc gets the notification items and switch render per differ to the notification item
 * and holds the whole page data or even actions
 * @extends {React.Component<IProps, IState>}
 */
class Notifications extends React.Component<IProps, IState> {
  private requestLimit: number = 20;
  // private startTouchPoint: number = 0;
  // private isInTop: boolean = true;

  /**
   * @constructor
   * Creates an instance of Notifications.
   * binds functions by `this`.
   * Notifictions is member of props.
   * Notifictions is gotten from redux. its possible we have notifications in redux store and we
   * can fill notification state with initial value
   * @param {object} props
   * @memberof Notifications
   */
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);

    /**
     * @default
     * @type {object}
     * @property {string} notifications - notification items
     */
    this.state = {
      notifications: this.props.notifications,
    };
  }

  /**
   * after mounting the component , recieve the notifications from api call and set it in redux store.
   * when the user seen the notifications scene need to notify the server and reset notification counter
   * @func componentDidMount
   * @memberof Notifications
   * @override
   */
  public componentDidMount() {

    // recieve notification before now
    this.getNotificationBefore(true, true);

    // resets the notifications counter by Api call
    const notificationApi = new NotificationApi();
    notificationApi.resetCounter();

    // set Timeout for ensuring the state changes.
    setTimeout(() => {
      let counter; // define counter object fills with `INotificationCountResponse` interface

      // this.props.notificationsCount from redux and is immutable and we need to clone it.
      // FIXME : clone in another way
      counter = JSON.parse(JSON.stringify(this.props.notificationsCount));
      counter.unread_notifications = 0;

      // store notifications counter object in redux
      this.props.setNotificationCount(counter);
    }, 1000);
  }

  /**
   * Gets the notification items from server before latest notification item time or now
   * @private
   * @param {boolean} saveInStore for saving the notification items in redux store
   * @param {boolean} getFromNow for force to get notifications from now.
   * @memberof Notifications
   */
  private getNotificationBefore(saveInStore: boolean, getFromNow?: boolean) {

    // define the notification Api class
    const notificationApi = new NotificationApi();

    // receive notifications with declared limits and before timestamp of
    // the latest notification item in state, otherwise the current timestamp.
    notificationApi.get({
      limit: this.requestLimit,
      before: getFromNow === true ? Date.now() : (this.state.notifications.length > 0) ?
        this.state.notifications[this.state.notifications.length - 1].timestamp : Date.now(),
    }).then((notificationsResponse: INotificationData) => {

      // check saveInStore value and store notification items in redux store
      if (saveInStore) {
        this.props.setNotification(notificationsResponse.notifications);
      }

      // concat recieved notifications items with current items and unique array by identifiers
      // and sorting the notification items by date
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(this.state.notifications), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      // Update state with new notifications array
      this.setState({
        notifications: notifs,
      });
    });
  }

  /**
   * Gets the notification items from server after certain time
   * @private
   * @memberof Notifications
   */
  private getNotificationAfter() {

    // define the notification Api class
    const notificationApi = new NotificationApi();

    // recieve notifications with declared limits and after timestamp of
    // the first notification item in state, otherwise the current timestamp.
    notificationApi.get({
      limit: this.requestLimit,
      after: this.state.notifications[0].timestamp,
    }).then((notificationsResponse: INotificationData) => {

      // store notification items in redux store
      if (notificationsResponse.notifications.length > 0) {
        this.props.setNotification(notificationsResponse.notifications);
      }

      // concat recieved notifications items with current items and unique array by identifiers
      // and sorting the notification items by date
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(this.state.notifications), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      // Update state with new notifications array
      this.setState({
        notifications: notifs,
      });
    });
  }

  /**
   * function gets the newest notification items
   * use function for pull to refresh action
   * @private
   * @param {function} resolve callback function for refreshing handler ( close the loading bar )
   * @memberof Notifications
   */
  private handleRefresh(resolve) {
    resolve();
    this.getNotificationAfter();
  }

  /**
   * Mark all notification items as seen
   *
   * @private
   * @memberof Notifications
   */
  private readAll() {

    // define the notification Api class
    const notificationApi = new NotificationApi();
    notificationApi.markAllRead();

    // Set the `read` property of all notification items to true
    const notifs = this.state.notifications.map((notif: INotification) => {
      let newNotif;
      newNotif = JSON.parse(JSON.stringify(notif));
      newNotif.read = true;
      return newNotif;
    });

    // store the new notification items in redux store
    this.props.setNotification(notifs);

    // update the state with new notification items
    this.setState({
      notifications: notifs,
    });
  }

  /**
   * mark as read notification item
   *
   * @private
   * @param {INotification} notification
   * @memberof Notifications
   */
  private readNotif(notification: INotification) {
    if ( notification.read ) {
      return;
    }
    // define the notification Api class
    const notificationApi = new NotificationApi();
    notificationApi.markAsRead({notification_id: notification._id});
    const notifs = this.state.notifications.map((notif: INotification) => {
      if (notification._id !== notif._id) {
        return notif;
      }
      // Set the `read` property of notification item to true
      let newNotif;
      newNotif = JSON.parse(JSON.stringify(notif));
      newNotif.read = true;
      return newNotif;
    });

    // store the new notification items in redux store
    this.props.setNotification(notifs);

    // update the state with new notification items
    this.setState({
      notifications: notifs,
    });
  }

  // private onTouchStart() {
  //   if (window.scrollY === 0) {
  //     this.isInTop = true;
  //     const touch = arguments[1].touches[0];
  //     this.startTouchPoint = touch.clientY;
  //     console.log(touch.clientY);
  //   }
  // }

  // private onTouchEnd() {
  //   console.log(arguments[1].touches[0]);
  // }

  // private onTouchMove() {
  //   console.log(arguments[1].touches[0]);
  //   const touch = arguments[1].touches[0];
  //   const trasnlated = touch.clientY - this.startTouchPoint > 0 ? touch.clientY - this.startTouchPoint : 0;
  //   if ( trasnlated > 80 ) {
  //     return;
  //   }
  //   console.log(trasnlated);

  //   document.getElementById('scrollWrp').style.maxHeight = trasnlated + 'px';
  // }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Notifications
   * @override
   * @generator
   */
  public render() {
    return (
      <div>
        <div className={style.notificationHead}>
          <h2>Notifications</h2>
          {/* mark all as see button */}
          <a onClick={this.readAll.bind(this, '')}>
            <IcoN size={24} name="listCheck24"/>
          </a>
        </div>
        <div className={style.notificationWrp}>
          {/* render items for all notification items */}
          {this.state.notifications.map((notification) =>
            (
              <div onClick={this.readNotif.bind(this, notification)} key={notification._id}>
                <NotificationItem notification={notification}/>
              </div>
            ))}
          {/* Load more notifications button */}
          <div className={privateStyle.loadMore}>
            <Button onClick={this.getNotificationBefore.bind(this, false)}>Load More</Button>
          </div>
          <div className={privateStyle.bottomSpace}/>
        </div>
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
  notifications: store.app.notifications,
  notificationsCount: store.app.notificationsCount,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notifications: INotification[]) => {
      dispatch(setNotification(notifications));
    },
    setNotificationCount: (counts: INotificationCountResponse) => {
      dispatch(setNotificationCount(counts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

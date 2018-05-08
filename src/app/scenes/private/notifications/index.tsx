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
import {INotification} from 'api/interfaces/';
import ArrayUntiles from 'services/utils/array';
import {connect} from 'react-redux';
import {setNotification, setNotificationCount} from '../../../redux/app/actions/index';
import {IcoN, InfiniteScroll, Loading} from 'components';
import INotificationCountResponse from '../../../api/notification/interfaces/INotificationCountResponse';

const style = require('./notifications.css');
const tabStyle = require('../../../components/Tab/tab.css');
const privateStyle = require('../private.css');

/**
 *
 * @implements
 * @interface IState
 */
interface IState {
  activeTab: number;
  postNotifications: INotification[];
  taskNotifications: INotification[];
}

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  setPostNotification: (notifications: INotification[]) => {};
  setTaskNotification: (notifications: INotification[]) => {};
  postNotifications: INotification[];
  taskNotifications: INotification[];
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
   * @prop notificationScrollbar
   * @desc Reference of notification scene scrollbar
   * @private
   * @type {HTMLDivElement}
   * @memberof Notifications
   */
  private notificationScrollbar: HTMLDivElement;
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
      postNotifications: this.props.postNotifications || [],
      taskNotifications: this.props.taskNotifications || [],
      activeTab: 0,
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

  private refresh = () => {
    this.getNotificationBefore(true, true);
  }

  private loadMore = () => {
    this.getNotificationBefore(true, false);
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
    const {activeTab} = this.state;
    const thisNotifs = activeTab === 0 ? this.state.postNotifications : this.state.taskNotifications ;
    console.log('getNotificationBefore', activeTab === 0 ? 'post' : 'task');
    // receive notifications with declared limits and before timestamp of
    // the latest notification item in state, otherwise the current timestamp.
    notificationApi.get({
      limit: this.requestLimit,
      before: getFromNow === true ? Date.now() : (thisNotifs.length > 0) ?
        thisNotifs[thisNotifs.length - 1].timestamp : Date.now(),
      details: true,
      subject: activeTab === 0 ? 'post' : 'task',
    }).then((notificationsResponse: INotificationData) => {

      // concat recieved notifications items with current items and unique array by identifiers
      // and sorting the notification items by date
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(thisNotifs), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      // Update state with new notifications array
      const state = {};
      state[activeTab === 0 ? 'postNotifications' : 'taskNotifications'] = notifs;
      this.setState(state);
      console.log(state);
      // check saveInStore value and store notification items in redux store
      if (saveInStore) {
        if (activeTab === 0) {
          this.props.setPostNotification(notifs);
        } else {
          this.props.setTaskNotification(notifs);
        }
      }
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
    const {activeTab} = this.state;
    const thisNotifs = activeTab === 0 ? this.state.postNotifications : this.state.taskNotifications;

    // recieve notifications with declared limits and after timestamp of
    // the first notification item in state, otherwise the current timestamp.
    notificationApi.get({
      limit: this.requestLimit,
      after: thisNotifs[0].timestamp,
      details: true,
      subject: activeTab === 0 ? 'post' : 'task',
    }).then((notificationsResponse: INotificationData) => {

      // store notification items in redux store
      if (notificationsResponse.notifications.length > 0) {
        if (activeTab === 0) {
          this.props.setPostNotification(notificationsResponse.notifications);
        } else {
          this.props.setTaskNotification(notificationsResponse.notifications);
        }
      }

      // concat recieved notifications items with current items and unique array by identifiers
      // and sorting the notification items by date
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(thisNotifs), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      // Update state with new notifications array
      const state = {};
      state[activeTab === 0 ? 'postNotifications' : 'taskNotifications'] = notifs;
      this.setState(state);
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
    const postNotifications = this.state.postNotifications.map((notif: INotification) => {
      let newNotif;
      newNotif = JSON.parse(JSON.stringify(notif));
      newNotif.read = true;
      return newNotif;
    });
    const taskNotifications = this.state.taskNotifications.map((notif: INotification) => {
      let newNotif;
      newNotif = JSON.parse(JSON.stringify(notif));
      newNotif.read = true;
      return newNotif;
    });

    // store the new notification items in redux store
    this.props.setPostNotification(postNotifications);
    this.props.setTaskNotification(taskNotifications);

    // update the state with new notification items
    this.setState({
      postNotifications,
      taskNotifications,
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
    const {activeTab} = this.state;
    const thisNotifs = activeTab === 0 ? this.state.postNotifications : this.state.taskNotifications;
    const notifs = thisNotifs.map((notif: INotification) => {
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
    if (activeTab === 0) {
      this.props.setPostNotification(notifs);
      // update the state with new notification items
      this.setState({
        postNotifications: notifs,
      });
    } else {
      this.props.setTaskNotification(notifs);
      // update the state with new notification items
      this.setState({
        taskNotifications: notifs,
      });
    }
  }

  private setTabPost = () => {
    this.setState({activeTab: 0}, () => this.getNotificationBefore(true, true));
  }

  private setTabTask = () => {
    this.setState({activeTab: 1}, () => this.getNotificationBefore(true, true));
  }

  /**
   * @func refHandler
   * @private
   * @memberof Notifications
   * @param {HTMLDivElement} value
   */
  private refHandler = (value) => {
    this.notificationScrollbar = value;
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Notifications
   * @override
   * @generator
   */
  public render() {
    return (
      <div className={style.notificationScrollbar} ref={this.refHandler}>
        <div className={style.notificationHead}>
          <h2>Notifications</h2>
          {/* mark all as see button */}
          <a onClick={this.readAll.bind(this, '')}>
            <IcoN size={24} name="listCheck24"/>
          </a>
        </div>
        <div className={tabStyle.tabHead}>
          <a onClick={this.setTabPost} className={this.state.activeTab === 0 ? 'active' : ''}>
            Post
          </a>
          <a onClick={this.setTabTask} className={this.state.activeTab === 1 ? 'active' : ''}>
            Task
          </a>
        </div>
        <div className={style.notificationWrp}>
          {/* render items for all notification items */}
          {this.state.activeTab === 1 && this.state.taskNotifications.length > 0 && (
            <InfiniteScroll
              pullDownToRefresh={true}
              refreshFunction={this.refresh}
              next={this.loadMore}
              route={'taskNotifications'}
              hasMore={true}
              loader={<Loading active={true} position="fixed"/>}>
                {this.state.taskNotifications.map((notification) =>
                  (
                    <div onClick={this.readNotif.bind(this, notification)} key={notification._id}>
                      <NotificationItem notification={notification}/>
                    </div>
                  ))}
                <div className={privateStyle.bottomSpace}/>
            </InfiniteScroll>
          )}
          {this.state.activeTab === 0 && this.state.postNotifications.length > 0 && (
            <InfiniteScroll
              pullDownToRefresh={true}
              refreshFunction={this.refresh}
              next={this.loadMore}
              route={'postNotifications'}
              hasMore={true}
              loader={<Loading active={true} position="fixed"/>}>
                {this.state.postNotifications.map((notification) =>
                  (
                    <div onClick={this.readNotif.bind(this, notification)} key={notification._id}>
                      <NotificationItem notification={notification}/>
                    </div>
                  ))}
                <div className={privateStyle.bottomSpace}/>
            </InfiniteScroll>
          )}
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
  postNotifications: store.app.postNotifications,
  taskNotifications: store.app.taskNotifications,
  notificationsCount: store.app.notificationsCount,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setPostNotification: (notifications: INotification[]) => {
      dispatch(setNotification(notifications));
    },
    setTaskNotification: (notifications: INotification[]) => {
      dispatch(setNotification(notifications));
    },
    setNotificationCount: (counts: INotificationCountResponse) => {
      dispatch(setNotificationCount(counts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

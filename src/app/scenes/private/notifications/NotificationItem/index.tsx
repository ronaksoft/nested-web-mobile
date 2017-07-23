/**
 * @auther naamsteh < naemabadei.shayesteh@gmail.com >
 * @auther sina < ehosseiniir@gmail.com >
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * This file renders the notification Items.
 * Component renders each notification item component by its type.
 */
import * as React from 'react';
import Comment from './Comment';
import Demoted from './Demoted';
import Invite from './Invite';
import InviteRespond from './InviteRespond';
import YouJoined from './YouJoined';
import Joined from './Joined';
import Mention from './Mention';
import NewSession from './NewSession';
import Promoted from './Promoted';
import PlaceSettingsChanged from './PlaceSettingsChanged';
import 'antd/dist/antd.css';
import INotification from '../../../../api/notification/interfaces/INotification';
import INotificationTypes from '../../../../api/notification/interfaces/INotificationTypes';

interface IProps {
  notification: INotification;
}

interface IState {
  notification: INotification;
}
/**
 * NotificationItem class : gets the notification items and switch render per differ to the notification item
 * and holds the whole page data or even actions
 * @class NotificationItem
 * @extends {React.Component<IProps, IState>}
 */
class NotificationItem extends React.Component<IProps, IState> {
  /**
   * Constructor
   * Creates an instance of Notifications.
   * Notifictions is member of props.
   * Notifictions is gotten from redux. its possible we have notifications in redux store and we
   * can fill notification state with initial value
   * @param props
   */
  constructor(props: IProps) {
    super(props);
    // setting initial states
    /**
     * @type {object}
     * @property {string} notifications notification items
     */
    this.state = {
      notification: this.props.notification,
    };
  }
  /**
   * after mounting the component , recieve the notifications from api call and set it in redux store.
   * when the user seen the notifications scene need to notify the server and reset notification counter
   * @memberof Notifications
   */
  public componentDidMount() {
    this.setState({
      notification: this.props.notification,
    });
  }

  /**
   * Creates an instance of Notifications
   * @param newProps
   */
  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      notification: newProps.notification,
    });
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Notifications
   */
  public render() {
    const notification = this.state.notification;
    switch (notification.type) {
      case INotificationTypes.COMMENT:
        return (
          <Comment notification={notification}/>
        );
      case INotificationTypes.DEMOTED:
        return (
          <Demoted notification={notification}/>
        );
      case INotificationTypes.INVITE:
        return (
          <Invite notification={notification}/>
        );
      case INotificationTypes.INVITE_RESPOND:
        return (
          <InviteRespond notification={notification}/>
        );
      case INotificationTypes.FRIEND_JOINED:
        return (
          <Joined notification={notification}/>
        );
      case INotificationTypes.YOU_JOINED:
        return (
          <YouJoined notification={notification}/>
        );
      case INotificationTypes.MENTION:
        return (
          <Mention notification={notification}/>
        );
      case INotificationTypes.NEW_SESSION:
        return (
          <NewSession notification={notification}/>
        );
      case INotificationTypes.PROMOTED:
        return (
          <Promoted notification={notification}/>
        );
      case INotificationTypes.PLACE_SETTINGS_CHANGED:
        return (
          <PlaceSettingsChanged notification={notification}/>
        );
      default:
        return null;
    }
  }
}

export {NotificationItem}

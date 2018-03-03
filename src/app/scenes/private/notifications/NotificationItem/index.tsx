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
import Comment from './post/Comment';
import Demoted from './post/Demoted';
import YouJoined from './post/YouJoined';
import Joined from './post/Joined';
import Mention from './post/Mention';
import NewSession from './post/NewSession';
import Promoted from './post/Promoted';
import PlaceSettingsChanged from './post/PlaceSettingsChanged';
import LabelApproved from './post/LabelApproved';
import LabelCreated from './post/LabelCreated';
import LabelJoined from './post/LabelJoined';
import LabelRejected from './post/LabelRejected';
// Task
import {Accepted, AddCandidate, Updated, Hold,
        AddWatcher, Assigned, AssigneeChanged,
        CommentTask, Completed, DuetimeUpdated,
        InProgress, MentionTask, Overdue, Rejected} from './task';
import 'antd/dist/antd.css';
import INotification from '../../../../api/notification/interfaces/INotification';
import INotificationTypes from '../../../../api/notification/interfaces/INotificationTypes';

interface IProps {
  /**
   * @property notification
   * @desc Includes notification as an object of notification data
   * @type {object}
   * @memberof IProps
   */
  notification: INotification;
}

interface IState {
  /**
   * @property notification
   * @desc Includes notification as an object of notification data
   * @type {object}
   * @memberof IState
   */
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
    /**
     * @type {object}
     * @desc setting initial states
     * @property {string} notification items
     */
    this.state = {
      notification: this.props.notification,
    };
  }
  /**
   * after mounting the component , recieve the notifications from api call and set it in redux store.
   * @memberof NotificationItem
   */
  public componentDidMount() {
    this.setState({
      notification: this.props.notification,
    });
  }

  /**
   * updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof NotificationItem
   */
  public componentWillReceiveProps(newProps: IProps) {
    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {string}
     */
    this.setState({
      notification: newProps.notification,
    });
  }
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof NotificationItem
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
      case INotificationTypes.INVITE_RESPOND:
        return <span>Deprecated</span>;
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
      case INotificationTypes.LABEL_REQUEST_APPROVED:
        return (
          <LabelApproved notification={notification}/>
        );
      case INotificationTypes.LABEL_REQUEST_CREATED:
        return (
          <LabelCreated notification={notification}/>
        );
      case INotificationTypes.LABEL_JOINED:
        return (
          <LabelJoined notification={notification}/>
        );
      case INotificationTypes.LABEL_REQUEST_REJECTED:
        return (
          <LabelRejected notification={notification}/>
        );
      // tasks
      case INotificationTypes.TASK_MENTION:
        return (
          <MentionTask notification={notification}/>
        );
      case INotificationTypes.TASK_COMMENT:
        return (
          <CommentTask notification={notification}/>
        );
      case INotificationTypes.TASK_ASSIGNED:
        return (
          <Assigned notification={notification}/>
        );
      case INotificationTypes.TASK_ASSIGNEE_CHANGED:
        return (
          <AssigneeChanged notification={notification}/>
        );
      case INotificationTypes.TASK_ADD_TO_CANDIDATES:
        return (
          <AddCandidate notification={notification}/>
        );
      case INotificationTypes.TASK_ADD_TO_WATCHERS:
        return (
          <AddWatcher notification={notification}/>
        );
      case INotificationTypes.TASK_DUE_TIME_UPDATED:
        return (
          <DuetimeUpdated notification={notification}/>
        );
      case INotificationTypes.TASK_OVER_DUE:
        return (
          <Overdue notification={notification}/>
        );
      case INotificationTypes.TASK_TITLE_UPDATED:
      case INotificationTypes.TASK_UPDATED:
        return (
          <Updated notification={notification}/>
        );
      case INotificationTypes.TASK_REJECTED:
        return (
          <Rejected notification={notification}/>
        );
      case INotificationTypes.TASK_ACCEPTED:
        return (
          <Accepted notification={notification}/>
        );
      case INotificationTypes.TASK_COMPLETED:
        return (
          <Completed notification={notification}/>
        );
      case INotificationTypes.TASK_HOLD:
        return (
          <Hold notification={notification}/>
        );
      case INotificationTypes.TASK_IN_PROGRESS:
        return (
          <InProgress notification={notification}/>
        );
      default:
        return null;
    }
  }
}

export {NotificationItem}

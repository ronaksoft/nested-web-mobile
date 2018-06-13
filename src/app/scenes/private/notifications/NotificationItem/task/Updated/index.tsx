/**
 * @file scenes/private/notifications/NotificationItem/Joined/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Joined.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each Joined notification item which is occuring when
 * an account Joinde to a Place.
 */
import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import {INotification} from 'api/interfaces/';
import TimeUntiles from '../../../../../../services/utils/time';
import {Link} from 'react-router';
import 'antd/dist/antd.css';

const style = require('../../NotificationItem.css');

interface IProps {
  /**
   * @property notification
   * @desc Includes notification as an object of notification data
   * @type {object}
   * @memberof IProps
   */
  notification: INotification;
}
/**
 * @class Accepted
 * @desc Creates Joined component:
 * @extends {React.Component<IProps, any>}
 */
export default class Overdue extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Joined
   */
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`/task/edit/${notification.task_id}/`}
            className={[style.notifWrapper, notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={notification.actor} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              {/* using FullName component for rendering Place full name */}
              <b><FullName user_id={notification.actor}/>.</b>
              <span> Changed the task status to overdue </span>
              {/* using utils service component for rendering correct time */}
              <span className={style.time}> •{TimeUntiles.dynamic(notification.timestamp)}</span>
            </p>
          </div>
          {/* TODO */}
          <IcoN size={16} name={'person16'}/>
        </div>
      </Link>
    );
  }
}

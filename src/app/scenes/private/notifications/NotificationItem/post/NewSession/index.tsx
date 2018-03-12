/**
 * @file scenes/private/notifications/NotificationItem/NewSession/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Mention.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each NewSession notification item which is occuring when
 * an account log in any time with any device.
 */
import * as React from 'react';
import {IcoN, UserAvatar} from 'components';
import INotification from '../../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../../services/utils/time';
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
 * @class NewSession
 * @desc Creates NewSession component
 * @extends {React.Component<IProps, any>}
 */
class NewSession extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Mention
   */
  public render() {
    const notification = this.props.notification;
    return (
      <div className={[style.notifWrapper, notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={notification.actor} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              <span><b>New login</b> from:</span>
              {/* setting client_id of notification for rendering log in devices */}
              <span> {notification.client_id.replace(/_/g, ' ')}.</span>
              {/* using utils service component for rendering correct time */}
              <span className={style.time}> •{TimeUntiles.dynamic(notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'devicePhone16'}/>
        </div>
      </div>
    );
  }
}

export default NewSession;

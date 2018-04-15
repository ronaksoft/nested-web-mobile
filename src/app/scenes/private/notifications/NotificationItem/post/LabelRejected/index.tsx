/**
 * @file scenes/private/notifications/NotificationItem/Mention/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Mention.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each Mention notification item which is occuring when
 * an account mention another account on a post.
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
 * @class Mention
 * @desc Creates Mention component:
 * @extends {React.Component<IProps, any>}
 */
class LabelRejected extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Mention
   */
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`/message/${notification.post_id}`}
            className={[style.notifWrapper, notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={notification.actor_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              <b>
                {/* using FullName component for rendering user full name */}
                <FullName user_id={notification.actor}/>
              </b>:
              your request for <span>{notification.label.title}</span> label is rejected
              {/* using utils service component for rendering correct time */}
              <span className={style.time}> •{TimeUntiles.dynamic(notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'atsign16'}/>
        </div>
      </Link>
    );
  }
}

export default LabelRejected;

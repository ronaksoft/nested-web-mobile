/**
 * @file scenes/private/notifications/NotificationItem/Invite/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Invite.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each Invite notification item which is occuring when
 * an account invite another account to a Place.
 */
import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../components/PlaceName';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/utils/time';
import {Link} from 'react-router';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

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
 * @class Invite
 * @desc Creates invite component:
 * @extends {React.Component<IProps, any>}
 */
class Invite extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Invite
   */
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`#/m/places/${notification.place_id}/messages`}
            className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              {/* using FullName component for rendering user full name */}
              <b><FullName user_id={this.props.notification.actor_id}/></b>
            <span> invited you to </span>
              {/* using PlaceName component for rendering Place name */}
              <b><PlaceName place_id={this.props.notification.place_id}/>.</b>
              {/* using utils service component for rendering correct time */}
              <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'devicePhone16'}/>
        </div>
      </Link>
    );
  }
}

export default Invite;

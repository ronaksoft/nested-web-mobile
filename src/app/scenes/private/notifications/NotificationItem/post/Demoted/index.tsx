/**
 * @file scenes/private/notifications/NotificationItem/Demoted/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @auther robzizo <  >
 * @desc This file renders the notification Item of Demoted.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each Demoted notification item which is occuring when
 * a manager demote another manager to member in a Place.
 */
import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../../components/PlaceName';
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
 * Demoted class : render notification item by Demoted type.
 * @class Demoted
 * @extends {React.Component<IProps, any>}
 */
class Demoted extends React.Component <IProps, any> {
  public render() {
    /**
     * @function render
     * @desc Renders the component
     * @returns
     * @memberof Demoted
     */
    const notification = this.props.notification;
    return (
      <Link to={`/places/${notification.place_id}/messages`}
            className={[style.notifWrapper, notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={notification.actor} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              {/* using FullName component for rendering user full name */}
              <b><FullName user_id={notification.actor}/></b>
              <span> demoted you in </span>
              {/* using PlaceName component for rendering Place name */}
              <b><PlaceName place_id={notification.place}/>.</b>
              <span className={style.time}> ???{TimeUntiles.dynamic(notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'person16'}/>
        </div>
      </Link>
    );
  }
}

export default Demoted;

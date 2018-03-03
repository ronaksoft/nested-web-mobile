/**
 * @file scenes/private/notifications/NotificationItem/PlaceSettingsChanged/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Mention.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each PlaceSettingsChanged notification item which is occuring when
 * an account change setting of a Place.
 */
import * as React from 'react';
import 'antd/dist/antd.css';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../../components/PlaceName';
import INotification from '../../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../../services/utils/time';
import {Link} from 'react-router';
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
 * @class PlaceSettingsChanged
 * @desc Creates PlaceSettingsChanged component
 * @extends {React.Component<IProps, any>}
 */
class PlaceSettingsChanged extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof PlaceSettingsChanged
   */
  public render() {
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
            <span> changed the settings of</span>
              {/* using PlaceName component for rendering Place name */}
              <PlaceName place_id={notification.place}/>.
            <span className={style.time}> •{TimeUntiles.dynamic(notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'devicePhone16'}/>
        </div>
      </Link>
    );
  }
}

export default PlaceSettingsChanged;

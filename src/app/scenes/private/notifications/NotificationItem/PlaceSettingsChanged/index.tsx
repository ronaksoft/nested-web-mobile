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
import PlaceName from '../../../../../components/PlaceName';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import {Link} from 'react-router';
const style = require('../NotificationItem.css');

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
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
      <Link to={`message/${notification.place_id}`}
      className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              {/* using FullName component for rendering user full name */}
              <b><FullName user_id={this.props.notification.actor_id}/></b>
            <span> changed the settings of</span>
              {/* using PlaceName component for rendering Place name */}
              <PlaceName place_id={this.props.notification.place_id}/>.
            <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'devicePhone16'}/>
        </div>
      </Link>
    );
  }
}

export default PlaceSettingsChanged;

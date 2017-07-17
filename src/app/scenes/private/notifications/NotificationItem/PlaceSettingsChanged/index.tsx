import * as React from 'react';
import 'antd/dist/antd.css';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../components/PlaceName';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import {Link} from 'react-router';
const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class PlaceSettingsChanged extends React.Component <IProps, any> {
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`message/${notification.place_id}`}
      className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
            <b><FullName user_id={this.props.notification.actor_id}/></b>
            <span> changed the settings of</span>
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

import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../components/PlaceName';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import {Link} from 'react-router';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Promoted extends React.Component <IProps, any> {
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`message/${notification.place_id}`} className={style.mention}>
        <div className={style.notifWrapper}>
            <UserAvatar user_id={this.props.notification.account_id} size={32} borderRadius={'16px'}/>
          <div className={style.notifContainer}>
            <div className={style.notifData}>
              <p>
              <b><FullName user_id={this.props.notification.actor_id}/></b>
              <span> promoted you in </span>
              <b><PlaceName place_id={this.props.notification.place_id}/>.</b>
              <span> {TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
              </p>
            </div>
            <IcoN size={16} name={'crown16'}/>
          </div>
        </div>
      </Link>
    );
  }
}

export default Promoted;

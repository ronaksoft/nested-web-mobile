import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import {Link} from 'react-router';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Mention extends React.Component <IProps, any> {
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`message/${notification.place_id}`}
      className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              <b>
              <FullName user_id={this.props.notification.account_id}/>
              </b>:
              <span><b> @{this.props.notification.account_id}.</b></span>
              <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </p>
          </div>
        <IcoN size={16} name={'atsign16'}/>
        </div>
      </Link>
    );
  }
}

export default Mention;

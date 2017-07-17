import * as React from 'react';
import {IcoN, UserAvatar} from 'components';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}
class NewSession extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.notifWrapper}>
        <UserAvatar user_id={this.props.notification.account_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
            <span><b>New login</b> from:</span>
            <span> {this.props.notification._cid.replace(/_/g, ' ')}.</span>
            <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'devicePhone16'}/>
        </div>
      </div>
    );
  }
}

export default NewSession;

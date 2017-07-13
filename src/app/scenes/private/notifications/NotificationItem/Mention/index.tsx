import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Mention extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div className={style.notifWrapper}>
              <UserAvatar user_id={this.props.notification.account_id} size={32} borderRadius={'16px'}/>
            <div className={style.notifContainer}>
              <div className={style.notifData}>
                <b>
              <FullName user_id={this.props.notification.account_id}/>
              </b>:
              <span><b> @{this.props.notification.account_id}.</b></span>
                <span> {TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </div>
            <IcoN size={16} name={'atsign16'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Mention;

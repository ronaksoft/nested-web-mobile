import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Promoted extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div className={style.notifWrapper}>
          <div className={style.notifContainer}>
            <div>
              <UserAvatar user_id={this.props.notification.account_id} size={32} borderRadius={'16px'}/>
            </div>
            <div>
              <b><FullName user_id={this.props.notification.actor_id}/></b>
              promoted you in
              {this.props.notification.place_id}
              {new Date(this.props.notification.timestamp).toString()}
            </div>
          </div>
          <div>
            <IcoN size={16} name={'devicePhone16'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Promoted;

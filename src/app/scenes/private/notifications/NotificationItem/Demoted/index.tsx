import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../components/PlaceName';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Demoted extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div className={style.notifWrapper}>
            <div>
              <UserAvatar user_id={this.props.notification.account_id} size={32} borderRadius={'16px'}/>
            </div>
          <div className={style.notifContainer}>
            <div className={style.notifData}>
                <b><FullName user_id={this.props.notification.actor_id}/></b>
              <span> demoted you in </span>
              <b><PlaceName plc_id={this.props.notification.place_id}/>.</b>
              <span> {TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </div>
            <IcoN size={16} name={'devicePhone16'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Demoted;

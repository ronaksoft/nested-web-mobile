import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import {IcoN, UserAvatar, FullName} from 'components';
import PlaceName from '../../../../../components/PlaceName';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class InviteRespond extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div className={style.notifWrapper}>
            <div>
              <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
            </div>
            <div>
              <b><FullName user_id={this.props.notification.actor_id}/></b>
              accepted your invitation and joined
              <b><PlaceName place_id={this.props.notification.place_id}/></b>
              {new Date(this.props.notification.timestamp).toString()}
            </div>
            <IcoN size={16} name={'devicePhone16'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default InviteRespond;

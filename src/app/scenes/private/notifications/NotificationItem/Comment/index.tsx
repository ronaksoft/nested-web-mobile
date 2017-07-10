import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import {IcoN, UserAvatar, FullName} from 'components';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Comment extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div className={style.notifWrapper}>
          <div className={style.notifContainer}>
            <div>
              <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
            </div>
            <div>
              <b><FullName user_id={this.props.notification.actor_id}/></b>
              commented on your post:
              {this.props.notification.comment_id}
              {new Date(this.props.notification.timestamp).toString()}
            </div>
          </div>
          <div>
            <IcoN size={16} name={'comment24'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;

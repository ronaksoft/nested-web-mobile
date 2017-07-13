import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import {IcoN, UserAvatar, FullName} from 'components';
import IUser from '../../../../../api/account/interfaces/IUser';
import CommentBody from '../../../../../components/CommentBody';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
  accounts: IUser[];
}

class Comment extends React.Component <IProps, any> {
  public render() {
    if (this.props.notification.others) {
      return (
      <div className={style.mention}>
        <div className={style.notifWrapper}>
          <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
          <div className={style.notifContainer}>
            <div className={style.notifData}>
              <b><FullName user_id={this.props.notification.actor_id}/></b>
              <span> commented on your post: </span>
              <CommentBody comment_id={this.props.notification.comment_id}
                           post_id={this.props.notification.post_id}/>.
              <span> {TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </div>
            <IcoN size={16} name={'comment24'}/>
          </div>
        </div>
      </div>
      );
    } else {
      return (
        <div className={style.mention}>
          <div className={style.notifWrapper}>
            <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
            <div className={style.notifContainer}>
              <div className={style.notifData}>
                <b><FullName user_id={this.props.notification.actor_id}/></b>
                <span> commented on your post: </span>
                <CommentBody comment_id={this.props.notification.comment_id}
                             post_id={this.props.notification.post_id}/>.
                <span> {TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
              </div>
              <IcoN size={16} name={'comment24'}/>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Comment;

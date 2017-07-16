import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import ArrayUntiles from '../../../../../services/untils/array';
import {IcoN, UserAvatar, FullName} from 'components';
import CommentBody from '../../../../../components/CommentBody';
import PostSubject from '../../../../../components/PostSubject';
import 'antd/dist/antd.css';
import {Link} from 'react-router';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Comment extends React.Component <IProps, any> {
  public render() {

    const notification = this.props.notification;
    let others = [];
    if (notification.data) {
      others = ArrayUntiles.uniqueArray(notification.data.others);
    }

    const indexOfActorInOthers = others.indexOf(notification.actor_id);
    if (indexOfActorInOthers > -1) {
      others.splice(indexOfActorInOthers, 1);
    }

    return (
      <div className={style.mention}>
        <Link to={`message/${notification.post_id}`}>
          <div className={style.notifWrapper}>
            <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
            {others &&
            others.map((userId: string, index: number) => {
              if (index < 3) {
                return <UserAvatar user_id={userId} size={24} borderRadius={'24px'}/>;
              }
            })
            }
            <div className={style.notifContainer}>
              <div className={style.notifData}>
                <b><FullName user_id={this.props.notification.actor_id}/> </b>
                {others &&
                others.map((userId: string, index: number) => {
                  if (index < 3) {
                    return <span>and <b><FullName user_id={userId}/></b></span>;
                  }
                })
                }
                <span> commented on <b><PostSubject post_id={notification.post_id}/></b>
              </span>
                <CommentBody comment_id={this.props.notification.comment_id}
                             post_id={this.props.notification.post_id}/>.
                <span> {TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
              </div>
              <IcoN size={16} name={'comment24'}/>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default Comment;

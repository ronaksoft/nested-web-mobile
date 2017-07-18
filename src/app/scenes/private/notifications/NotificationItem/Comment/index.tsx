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
      <Link to={`/message/${notification.post_id}`}
      className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        { others.length > 0 && (
          <div className={style.commentContainer}>
            <div className={style.multiAvatars}>
              {others &&
              others.map((userId: string, index: number) => {
                if (index < 3) {
                  return <UserAvatar user_id={userId} size={24} borderRadius={'24px'}/>;
                } else {
                  return (
                    <div className={style.plus}>+{index - 2}</div>
                  );
                }
              })
              }
              <div className={style.filler}/>
              <IcoN size={16} name={'comment24Crown'}/>
            </div>
            <div className={style.notifData}>
              <p>
                <b><FullName user_id={this.props.notification.actor_id}/> </b>
                {others &&
                others.map((userId: string, index: number) => {
                  if (index < 3) {
                    return <span> and <b><FullName user_id={userId}/></b></span>;
                  }
                })
                }
                <span>
                  commented on
                  <b><PostSubject post_id={notification.post_id}/></b>
                </span>
                <CommentBody comment_id={this.props.notification.comment_id}
                              post_id={this.props.notification.post_id}/>.
                <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
              </p>
            </div>
          </div>
        )}
        {others.length === 0 && (
          <div className={style.notifContainer}>
            <div className={style.notifData}>
              <p>
                <b><FullName user_id={this.props.notification.actor_id}/> </b>
                <span>
                  commented on
                  <b><PostSubject post_id={notification.post_id}/></b>
                </span>
                <CommentBody comment_id={this.props.notification.comment_id}
                              post_id={this.props.notification.post_id}/>.
                <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
              </p>
            </div>
            <IcoN size={16} name={'comment24Crown'}/>
          </div>
        )}

      </Link>
    );
  }
}

export default Comment;

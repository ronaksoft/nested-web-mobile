/**
 * @file scenes/private/notifications/NotificationItem/Comment/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @auther robzizo <  >
 * @desc This file renders the notification Item of Comment.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each Comment notification item which is occuring when
 * users comment on a post.
 * This component has two UI which one of them is
 * rendering when we have less than 3 users that
 * comment on a post and another is rendering
 * when we have more than 3 users comment on a post.
 */
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
/**
 * Comment class : render notification item by Comment type.
 * @class Comment
 * @extends {React.Component<IProps, any>}
 */
class Comment extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Comment
   */
  public render() {
    const notification = this.props.notification;
    // setting others as an array of users who commenting on a post
    let others = [];
    if (notification.data) {
      // setting a unique array
      others = ArrayUntiles.uniqueArray(notification.data.others);
    }
    // defining indexOfActorInOthers const
    const indexOfActorInOthers = others.indexOf(notification.actor_id);
    if (indexOfActorInOthers > -1) {
      others.splice(indexOfActorInOthers, 1);
    }
    // define more as a count of users and setting inital it to zero
    let more = 0;
    // define othersDoms as an array
    const othersDoms = [];
    others.map((userId: string, index: number) => {
      // rendering multi user avatar when counts of users less than 3
      if (index < 3) {
        return othersDoms.push(<UserAvatar user_id={userId} size={24} borderRadius={'24px'}/>);
      } else {
        return more++;
      }
    });
    // rendering multi user avatar when counts of users more than 3
    if ( more > 0) {
      othersDoms.push(<div className={style.plus}>+{more}</div>);
    }
    return (
      <Link to={`/m/message/${notification.post_id}`}
      className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        {/* rendering comment component when more than one user commenting */}
        { others.length > 0 && (
          <div className={style.commentContainer}>
            <div className={style.multiAvatars}>
              {others && othersDoms}
              <div className={style.filler}/>
              <IcoN size={16} name={'comment24Crown'}/>
            </div>
            <div className={style.notifData}>
              <p>
                {/* using FullName component for rendering user full name */}
                <b><FullName user_id={this.props.notification.actor_id}/> </b>
                {others &&
                others.map((userId: string, index: number) => {
                  if (index < 3) {
                    {/* using FullName component for rendering user full name */}
                    return <span> and <b><FullName user_id={userId}/></b></span>;
                  }
                })
                }
                <span>
                  commented on
                  {/* using PostSubject component for rendering post subject full */}
                  <b><PostSubject post_id={notification.post_id}/></b>
                </span>
                {/* using CommentBody component for rendering body of comment */}
                <CommentBody comment_id={this.props.notification.comment_id}
                              post_id={this.props.notification.post_id}/>.
                <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
              </p>
            </div>
          </div>
        )}
        {/* rendering comment component when just a user commenting */}
        {others.length === 0 && (
          <div className={style.notifContainer}>
            <div className={style.notifData}>
              <p>
                {/* using FullName component for rendering Place full name */}
                <b><FullName user_id={this.props.notification.actor_id}/> </b>
                <span>
                  commented on
                  {/* using PostSubject component for rendering post subject full */}
                  <b><PostSubject post_id={notification.post_id}/></b>
                </span>
                {/* using CommentBody component for rendering body of comment */}
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

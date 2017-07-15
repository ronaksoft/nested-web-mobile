import * as React from 'react';
import IPost from '../../../../../api/post/interfaces/IPost';
import {IcoN, UserAvatar, FullName} from 'components';
import IPlace from '../../../../../api/place/interfaces/IPlace';
import TimeUntiles from '../../../../../services/untils/time';
const style = require('./post.css');

interface IProps {
  post: IPost;
}

interface IState {
  post: IPost;
}

class Post extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {post: this.props.post};
  }

  public toggleBookmark = () => {
    const postM = this.state.post;
    postM.pinned = !postM.pinned;
    this.setState({
      post : postM,
    });
  }

  public render() {
    const {post} = this.state;
    const sender = post.email_sender ? post.email_sender : post.sender;
    return (
      <div className={style.postCard}>
        <div className={style.postHead}>
          <UserAvatar user_id={sender._id} size={32} borderRadius={'16px'}/>
          {post.reply_to && <IcoN size={16} name={'replied16'}/>}
          {post.forward_from && <IcoN size={16} name={'forward16'}/>}
          {post.sender && <FullName user_id={post.sender._id}/>}
          {post.email_sender && (
              <span>
                `${post.email_sender._id}`
              </span>
            )}
          <p>
            {TimeUntiles.dynamic(post.timestamp)}
          </p>
          {!post.post_read && <IcoN size={16} name={'circle8blue'}/>}
          <div className={post.pinned ? style.postPinned : style.postPin} onClick={this.toggleBookmark}>
            {post.pinned && <IcoN size={24} name={'bookmark24Force'}/>}
            {!post.pinned && <IcoN size={24} name={'bookmarkWire24'}/>}
          </div>
        </div>
        <div className={style.postBody}>
          <h3>{post.subject}</h3>
          <p>
            {post.body}
          </p>
          {post.post_attachments.length > 0 && (
            <div className={style.postAttachs}>
              <IcoN size={16} name={'attach16'}/>
              {post.post_attachments.length}
              {post.post_attachments.length === 1 && <span>Attachment</span>}
              {post.post_attachments.length > 1 && <span>Attachments</span>}
            </div>
          )}
          <div className={style.postPlaces}>
            {post.post_places.map((place: IPlace, index: number) => {
              if (index < 2) {
                return <span>{place._id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
              }
            })}
            {post.post_places.length >= 2 && <span>+{post.post_places.length - 2}</span>}
          </div>

          <div className={style.postFooter}>
            <IcoN size={16} name={'comment24'}/>
            {post.counters.comments <= 1 && <p>{post.counters.comments} comment</p>}
            {post.counters.comments > 1 && <p>{post.counters.comments} comments</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;

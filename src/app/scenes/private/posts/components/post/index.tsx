import * as React from 'react';
import IPost from '../../../../../api/post/interfaces/IPost';
import {IcoN, UserAvatar, FullName} from 'components';
import IPlace from '../../../../../api/place/interfaces/IPlace';
import TimeUntiles from '../../../../../services/untils/time';

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

  public render() {
    const {post} = this.state;
    const sender = post.email_sender ? post.email_sender : post.sender;
    return (
      <div>
        <div>
          <UserAvatar user_id={sender._id} size={32} borderRadius={'16px'}/>
          {post.reply_to && <IcoN size={16} name={'replied16'}/>}
          {post.forward_from && <IcoN size={16} name={'forward16'}/>}
          {post.sender && <FullName user_id={post.sender._id}/>}
          {post.email_sender && `${post.email_sender._id}`}
          {TimeUntiles.dynamic(post.timestamp)}
          {post.pinned && <IcoN size={16} name={'bookmark24'}/>}
          {!post.pinned && <IcoN size={16} name={'bookmarkWire24'}/>}
        </div>
        <div>
          <h3>{post.subject}</h3>
          <p>
            {post.body}
          </p>
          {post.post_attachments.length > 0 && (
            <div>
            <IcoN size={16} name={'attach16'}/>
            {post.post_attachments.length}
            {post.post_attachments.length === 1 && <span>Attachment</span>}
            {post.post_attachments.length > 1 && <span>Attachments</span>}
          </div>
          )}
          <div>
            {post.post_places.map((place: IPlace, index: number) => {
              if (index < 3) {
                return <span> {place._id} </span>;
              }
            })}
            {post.post_places.length > 3 && <span>+{post.post_places.length - 3}</span>}
          </div>

          <div>
            <IcoN size={16} name={'comment16'}/>
            {post.counters.comments}
            {post.counters.comments <= 1 && <span>comment</span>}
            {post.counters.comments > 1 && <span>comments</span>}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;

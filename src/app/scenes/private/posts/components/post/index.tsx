import * as React from 'react';
import IPost from '../../../../../api/post/interfaces/IPost';
import {IcoN, UserAvatar, FullName} from 'components';
import IPlace from '../../../../../api/place/interfaces/IPlace';
import TimeUntiles from '../../../../../services/untils/time';
import PostApi from '../../../../../api/post/index';
import {connect} from 'react-redux';
import {setCurrentPost, setPosts} from '../../../../../redux/app/actions/index';
import CommentsBoard from '../comment/index';
import PostAttachment from '../../../../../components/PostAttachment/index';
import {browserHistory, Link} from 'react-router';

const style = require('./post.css');
const styleNavbar = require('../../../../../components/navbar/navbar.css');

interface IOwnProps {
  post?: IPost;
  routeParams?: any;
}

interface IProps {
  post: IPost;
  currentPost: IPost;
  posts: IPost[];
  routeParams: any;
  setPosts: (posts: IPost[]) => {};
  setCurrentPost: (post: IPost) => {};
}

interface IState {
  post?: IPost | null;
}

class Post extends React.Component<IProps, IState> {
  private inProgress: boolean;

  constructor(props: IProps) {
    super(props);
    this.state = {};
    this.inProgress = false;
    this.state = {post: this.props.post};
  }

  public componentDidMount() {
    if (this.props.post) {
      this.setState({
        post: this.props.post ? this.props.post : null,
      });
    } else {
      const postApi = new PostApi();
      postApi.getPost(this.props.routeParams.postId ? this.props.routeParams.postId : this.props.post._id, true)
        .then((post: IPost) => {
          post.post_read = true;
          this.setState({
            post,
          });
          this.updatePostsInStore('post_read', true);
        });
      window.scrollTo(0, 0);
    }
  }

  public componentWillReceiveProps(newProps: IProps) {
    if (this.props.post) {
      this.setState({
        post: newProps.post ? newProps.post : null,
      });
    }
  }

  private updatePostsInStore(key: string, value: any) {

    const posts = JSON.parse(JSON.stringify(this.props.posts));
    let newPosts;
    newPosts = posts.map((post: IPost) => {
      if (post._id === this.state.post._id) {
        post[key] = value;
      }
      return post;
    });

    this.props.setPosts(newPosts);

    if (this.props.currentPost) {
      this.props.setCurrentPost(this.props.currentPost);
    }
  }

  private leave() {
    browserHistory.goBack();
  }

  private toggleBookmark() {
    // change pinned of post
    let post;
    post = this.state.post;
    post.pinned = !post.pinned;
    this.setState({post});

    // create an PostApi and make api call based on post.pinned
    const postApi = new PostApi();
    if (this.state.post.pinned) {
      postApi.pinPost(this.state.post._id)
        .then(() => {
          // set action is not in progress
          this.inProgress = false;
          // Update posts in store
          this.updatePostsInStore('pinned', true);
        })
        .catch(() => {
          // roll back if has error in api call
          let post;
          this.inProgress = false;
          post = this.state.post;
          post.pinned = !post.pinned;
          this.setState({post});
        });
    } else {
      postApi.unpinPost(this.state.post._id)
        .then(() => {
          // set action is not in progress
          this.inProgress = false;
          this.updatePostsInStore('pinned', false);
        })
        .catch(() => {

          // set action is not in progress
          this.inProgress = false;

          // roll back if has error in api call
          let post;
          post = this.state.post;
          post.pinned = !post.pinned;
          this.setState({post});
        });
    }
  }

  public render() {
    const postView = !this.props.post;
    if (!this.state.post) {
      return <div>Loading ...</div>;
    }

    const {post} = this.state;
    const sender = post.email_sender ? post.email_sender : post.sender;
    return (
      <div className={[style.postCard, !this.props.post ? style.postView : null].join(' ')}>
        {postView && (
          <div className={styleNavbar.navbar}>
            <a onClick={this.leave}>
              <IcoN size={24} name="xcross24"/>
            </a>
            <div className={styleNavbar.filler}/>
            <Link to={`/m/forward/${post._id}`}>
              <IcoN size={24} name="forward16"/>
            </Link>
            <Link to={`/m/reply/${post._id}`}>
              <IcoN size={24} name="reply24"/>
            </Link>
            {/*<a>
              <IcoN size={24} name="more24"/>
            </a>*/}
          </div>
        )}
        <div className={style.postHead}>
          <UserAvatar user_id={sender._id} size={32} borderRadius={'16px'}/>
          {post.reply_to && <IcoN size={16} name={'replied16Green'}/>}
          {post.forward_from && <IcoN size={16} name={'forward16Blue'}/>}
          {post.sender && <FullName user_id={post.sender._id}/>}
          {post.email_sender && (
            <span>
              {`${post.email_sender._id}`}
            </span>
          )}
          <p>
            {TimeUntiles.dynamic(post.timestamp)}
          </p>
          {!post.post_read && <IcoN size={16} name={'circle8blue'}/>}
          <div className={post.pinned ? style.postPinned : style.postPin}
               onClick={this.toggleBookmark.bind(this, '')}>
            {post.pinned && <IcoN size={24} name={'bookmark24Force'}/>}
            {!post.pinned && <IcoN size={24} name={'bookmarkWire24'}/>}
          </div>
        </div>
        {!this.props.post && <hr/>}
        <div className={style.postBody}>
          <h3>{post.subject}</h3>
          <div dangerouslySetInnerHTML={{__html: post.body}}/>
          {post.post_attachments.length > 0 && !this.props.post && (
            <PostAttachment attachments={post.post_attachments}/>
          )}
          {post.post_attachments.length > 0 && this.props.post && (
            <div className={style.postAttachs}>
              <IcoN size={16} name={'attach24'}/>
              {post.post_attachments.length}
              {post.post_attachments.length === 1 && <span>Attachment</span>}
              {post.post_attachments.length > 1 && <span>Attachments</span>}
            </div>
          )}
          <div className={style.postPlaces}>
            {postView && <a>Shared with:</a>}
            {post.post_places.map((place: IPlace, index: number) => {
              if (index < 2) {
                return <span>{place._id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
              }
            })}
            {post.post_places.length > 2 && <span>+{post.post_places.length - 2}</span>}
          </div>

          {!postView && (
            <div className={style.postFooter}>
              <IcoN size={16} name={'comment24'}/>
              {post.counters.comments <= 1 && <p>{post.counters.comments} comment</p>}
              {post.counters.comments > 1 && <p>{post.counters.comments} comments</p>}
            </div>
          )}
        </div>
        {!this.props.post &&
        <CommentsBoard no_comment={this.state.post.no_comment} post_id={this.state.post._id} post={this.state.post}/>
        }
      </div>
    );
  }
}

const mapStateToProps = (store, ownProps: IOwnProps) => ({
  post: ownProps.post,
  currentPost: store.app.currentPost,
  posts: store.app.posts,
  routeParams: ownProps.routeParams,
});

const mapDispatchToProps = (dispatch) => ({
  setPosts: (posts: IPost[]) => (dispatch(setPosts(posts))),
  setCurrentPost: (post: IPost) => (dispatch(setCurrentPost(post))),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);

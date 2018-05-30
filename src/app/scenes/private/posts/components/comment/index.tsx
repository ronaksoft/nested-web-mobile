/**
 * @file scenes/private/posts/components/comment/index.tsx
 * @author Sina Hosseini <ehosseiniir@gmail.com>
 * @description A comment-board component
 * @export CommentsBoard
 * Documented by:          Soroush Torkzadeh <sorousht@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import PostApi from 'api/post/index';
import TaskApi from 'api/task/index';
import {IComment} from 'api/interfaces';
import {UserAvatar, FullName} from 'components';
import CommentApi from 'api/comment/index';
import ArrayUntiles from 'services/utils/array';
import TimeUntiles from 'services/utils/time';
import {IcoN, Loading} from 'components';
import IPost from 'api/post/interfaces/IPost';
import SyncPostActivity from 'services/sync-post-activity';
import SyncPostActions from 'services/sync-post-activity/actions';
import {IUser} from 'api/interfaces';
import RTLDetector from '../../../../../components/RTLDetector/';
import {some, orderBy, filter, findIndex, chain} from 'lodash';
import {message} from 'antd';
import VoiceComment from '../VoiceComment';
import MiniPlayer from '../../../../../../app/services/miniplayer';

const style = require('./comment-board.css');

/**
 * @interface IProps
 * @desc Interface of the component props
 */
interface IProps {
  /**
   * @prop post_id
   * @desc The post Id
   * @type {string}
   * @memberof IProps
   */
  post_id: string;
  /**
   * @prop post
   * @desc The post that the comments belogs to
   * @type {IPost}
   * @memberof IProps
   */
  post?: IPost;
  /**
   * @prop no_comment
   * @desc Is commenting enabled on the post or not
   * @type {boolean}
   * @memberof IProps
   */
  no_comment?: boolean;
  task_mode?: boolean;
  /**
   * @prop user
   * @desc Logged in user for sending comment
   * @type {IUser}
   * @memberof IProps
   */
  user?: IUser;
  newComment?: () => void;
}

/**
 * @interface IState
 * @desc Interface of the component state
 */
interface IState {
  /**
   * @prop comments
   * @desc A list of comments on the board
   * @type {IComment[]}
   * @memberof IState
   */
  comments: IComment[];
  /**
   * @prop sendingComment
   * @desc Indicates that a comment
   * @type {boolean}
   * @memberof IState
   */
  sendingComment: boolean;
  /**
   * @prop newCommentTxt
   * @desc A new comment text
   * @type {string}
   * @memberof IState
   */
  newCommentTxt: string;
}

/**
 * @class CommentsBoard
 * @desc A list of a post comment with a new comment input box
 * @extends {React.Component<IProps, IState>}
 */
class CommentsBoard extends React.Component<IProps, IState> {
  /**
   * @prop postApi
   * @desc A new instance of postApi
   * @private
   * @memberof CommentsBoard
   */
  private Api;
  private sendCommentCount: number = 0;
  /**
   * @prop syncPostActivity
   * @desc An instance SyncPlaceActivity
   * @private
   * @memberof CommentsBoard
   */
  private syncPostActivity = SyncPostActivity.getInstance();
  /**
   * @prop syncActivityListeners
   * @desc The channels of activity which the component is listening to
   * @private
   * @memberof CommentsBoard
   */
  private syncActivityListeners = [];
  /**
   * @prop hasBeforeComments
   * @desc A flag to identify that the post has older comments or not
   * @private
   * @type {boolean}
   * @memberof CommentsBoard
   */
  private hasBeforeComments: boolean = true;

  private notifyNewComment: () => void = () => console.log('no notify registered!');

  /**
   * @constructor
   * Creates an instance of CommentsBoard.
   * @param {IProps} props
   * @memberof CommentsBoard
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      comments: [],
      sendingComment: false,
      newCommentTxt: '',
    };
    // binds handleChangeComment by `this`.
    this.handleChangeComment = this.handleChangeComment.bind(this);
    if (typeof this.props.newComment === 'function') {
      this.notifyNewComment = this.props.newComment;
    }
    MiniPlayer.getInstance().setPlaylist('voice-comment-' + this.props.post_id, true);
  }

  /**
   * @func componentDidMount
   * @desc When the component has been mounted successfully, It retreives the post last 3 comments
   * and opens a channel for getting notified for new comments.
   * @memberof CommentsBoard
   * @override
   */
  public componentDidMount() {
    if (!this.props.task_mode) {
      this.Api = new PostApi();
      this.Api.getComments({
        before: Date.now(),
        limit: 3,
        post_id: this.props.post_id,
      })
        .then((comments: IComment[]) => {

          if (comments.length < 3) {
            this.hasBeforeComments = false;
          }

          this.setState({
            comments: orderBy(comments, 'timestamp', 'asc'),
          });
        })
        .catch(console.log);
      // set sync listeners
      if (this.props.post && this.props.post.post_places) {
        this.syncActivityListeners.push(
          this.syncPostActivity.openChannel(
            this.props.post._id,
            SyncPostActions.COMMENT_ADD,
            () => {
              this.getAfterComments(true);
            },
          ));
      }
    } else {
      this.Api = new TaskApi();
      this.Api.getActivities({
        task_id: this.props.post_id,
        only_comments: true,
        details: true,
      });
    }
  }

  /**
   * @func componentWillUnmount
   * @desc Stops listening to the sync channels when the component is going to be destroyed
   * @memberof CommentsBoard
   * @override
   */
  public componentWillUnmount() {
    // set sync listeners
    if (this.props.post) {
      this.syncActivityListeners.forEach((canceller) => {
        canceller();
      });
    }
  }

  /**
   * @func getAfterComments
   * @desc Get comments recursively while reaches the end
   * @private
   * @param {boolean} [scrollToBottom]
   * @memberof CommentsBoard
   */
  private getAfterComments(scrollToBottom?: boolean) {
    // const lastCommeent = last(orderBy(filter(
    //   this.state.comments, (cm) => cm._id.length > 4),
    //   'timestamp'));
    // The sync do not work well so we get comments after before last comment temporary
    const lastCommeents = orderBy(filter(
      this.state.comments, (cm) => cm._id.length > 4),
      'timestamp');
    const lastComment = lastCommeents[lastCommeents.length - 2];
    this.Api.getComments({
      after: this.state.comments.length > 0 && lastComment ?
        lastComment.timestamp : Date.now() - 60000,
      limit: 20,
      post_id: this.props.post_id,
    })
      .then((comments: IComment[]) => {

        const newComments = chain(comments)
          .filter((comment) => !some(this.state.comments, {_id: comment._id}))
          .orderBy('timestamp', 'asc').value();

        const sentComments = filter(this.state.comments, (cm) => cm._id.length < 10);
        const newCommentsFromOthers = filter(newComments,
          (cm) => !some(sentComments, (sentCm) => sentCm.body === cm.body && sentCm.sender._id === cm.sender._id));
        this.setState({
          comments: ArrayUntiles.uniqueObjects(newCommentsFromOthers.concat(this.state.comments), '_id')
            .sort((a: IComment, b: IComment) => {
              return a.timestamp - b.timestamp;
            }),
        }, () => {
          if (scrollToBottom) {
            this.notifyNewComment();
          }
          if (comments.length === 20) {
            this.getAfterComments(true);
          }
        });
      });
  }

  /**
   * @func getBeforeComments
   * @desc Loads the comments that are older than the last comment of the board
   * @private
   * @memberof CommentsBoard
   */
  private getBeforeComments() {
    this.Api.getComments({
      before: this.state.comments[0].timestamp,
      limit: 20,
      post_id: this.props.post_id,
    })
      .then((comments: IComment[]) => {

        if (comments.length < 20) {
          this.hasBeforeComments = false;
        }

        this.setState({
          comments: ArrayUntiles.uniqueObjects(comments.concat(this.state.comments), '_id')
            .sort((a: IComment, b: IComment) => {
              return a.timestamp - b.timestamp;
            }),
        });
      });
  }

  /**
   * @func addComment
   * @desc Adds a new comment to the post and requests to get the recent comments to keep the board update.
   * @private
   * @memberof CommentsBoard
   */
  private addComment(txt: string) {
    const commentApi = new CommentApi();
    return new Promise((resolve, reject) => {
      commentApi.addComment({
        post_id: this.props.post_id,
        txt,
      }).then((res) => {
        return commentApi.getOne({
          comment_id: res.comment_id,
          post_id: this.props.post_id,
        }).then((res) => {
          resolve(res.comments[0]);
        });
      }).catch(reject);

    });
  }

  /**
   * @function handleChangeComment
   * @desc Updates the new comment text in the component state
   * @private
   * @param {*} e
   * @memberof CommentsBoard
   */
  private handleChangeComment(event: any) {
    const text = event.target.value;
    if (text.length === 0 || event.key !== 'Enter') {
      return;
    }

    const commentModel: IComment = {
      attachment_id: '',
      text,
      _id: this.sendCommentCount + '',
      removed: false,
      removed_by: '',
      removed_by_id: '',
      sender: this.props.user,
      sender_id: '',
      timestamp: Date.now(),
      isSending: true,
    };

    this.sendCommentCount++;

    this.setState({
      comments: [...this.state.comments, commentModel],
    }, () => {
      this.notifyNewComment();
    });
    event.target.value = '';
    // event.target.focus();
    this.addComment(text).then((comment) => {
      this.addCommentCallback(comment, commentModel);
    }).catch(() => this.addCommentFailedCallback(commentModel));
  }

  private addCommentCallback(comment, commentModel) {
    const comments = this.state.comments;
    const index = findIndex(comments, {_id: commentModel._id});
    if (some(comments, {
        _id: comment._id,
      })) {
      comments.splice(index, 1);
    } else {
      comments[index] = comment;
    }
    this.setState({comments}, () => {
      this.getAfterComments(true);
    });
  }

  private addCommentFailedCallback(commentModel) {
    const comments = this.state.comments;
    const index = findIndex(comments, {_id: commentModel._id});
    if (index > -1) {
      comments[index].isSending = false;
      comments[index].isFailed = true;
    }
    this.setState({comments});
    message.error('Sorry, an error has occurred in sending your comment');
  }

  private retrySendComment(commentModel: IComment) {
    this.addComment(commentModel.text).then((comment) => {
      this.addCommentCallback(comment, commentModel);
    }).catch(() => {
      this.addCommentFailedCallback(commentModel);
    });
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof CommentsBoard
   * @generator
   */
  public render() {
    return (
      <div className={style.commentBoard} id={'comment-board'}>
        {
          this.hasBeforeComments && (
            <div id={'load-older-comments'} className={style.loadMore}
                 onClick={this.getBeforeComments.bind(this, '')}
            >
              <IcoN size={16} name={'comments16'}/>
              Load older comments
            </div>
          )
        }
        {this.state.comments.map((comment: IComment) => (
          <div id={comment._id} key={comment._id} className={style.commentRow}>
            {!comment.isSending && <UserAvatar user_id={comment.sender._id} size={24} borderRadius={'16px'}/>}
            {comment.isSending && <Loading active={true} size="sm24"/>}
            <div className={style.commentContent}>
              <div className={style.commentHead}>
                <a><FullName user_id={comment.sender._id}/></a>
                <span>{TimeUntiles.dynamic(comment.timestamp)}</span>
              </div>
              {comment.isFailed && <a onClick={this.retrySendComment.bind(this, comment)}>Failed ! Retry</a>}
              {comment.attachment_id === '' &&
              <p className={RTLDetector.getInstance().direction(comment.text) ? style.Rtl : ''}>{comment.text}</p>
              }
              {comment.attachment_id !== '' &&
              <VoiceComment comment={comment} post={this.props.post}/>
              }
            </div>
          </div>
        ))}
        {!this.props.no_comment && (
          <div className={style.commentInput}>
            <UserAvatar user_id={this.props.user} size={24} borderRadius={'16px'}/>
            <input type="text" placeholder={'write your comment...'} defaultValue={this.state.newCommentTxt}
                   onKeyDown={this.handleChangeComment}/>
          </div>
        )}
      </div>
    );
  }
}

export default CommentsBoard;

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
import IComment from 'api/comment/interfaces/IComment';
import {UserAvatar, FullName, NstInput} from 'components';
import CommentApi from 'api/comment/index';
import ArrayUntiles from 'services/utils/array';
import TimeUntiles from 'services/utils/time';
import {IcoN} from 'components';
import IPost from 'api/post/interfaces/IPost';
import SyncActivity from 'services/syncActivity/index';
import SyncActions from 'services/syncActivity/syncActions';
import IUser from '../../../../../api/account/interfaces/IUser';
import RTLDetector from '../../../../../components/RTLDetector/';
import VoiceComment from '../VoiceComment';

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
  /**
   * @prop user
   * @desc Logged in user for sending comment
   * @type {IUser}
   * @memberof IProps
   */
  user?: IUser;
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
  private postApi;
  /**
   * @prop syncActivity
   * @desc An instance SyncActivity
   * @private
   * @memberof CommentsBoard
   */
  private syncActivity = SyncActivity.getInstance();
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

  }

  /**
   * @func componentDidMount
   * @desc When the component has been mounted successfully, It retreives the post last 3 comments
   * and opens a channel for getting notified for new comments.
   * @memberof CommentsBoard
   * @override
   */
  public componentDidMount() {
    this.postApi = new PostApi();
    this.postApi.getComments({
      before: Date.now(),
      limit: 3,
      post_id: this.props.post_id,
    })
      .then((comments: IComment[]) => {

        if (comments.length < 3) {
          this.hasBeforeComments = false;
        }

        this.setState({
          comments,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // set sync listeners
    if (this.props.post && this.props.post.post_places) {
      this.syncActivityListeners.push(
        this.syncActivity.openChannel(
          this.props.post.post_places[0]._id,
          SyncActions.COMMENT_ADD,
          () => {
            if (document.documentElement.scrollHeight - 20 >
            document.documentElement.scrollTop + document.documentElement.clientHeight) {
              this.getAfterComments(true);
            } else {
              this.getAfterComments(false);
            }
          },
        ));
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
    this.postApi.getComments({
      after: this.state.comments.length > 0 ?
        this.state.comments[this.state.comments.length - 1].timestamp : Date.now() - 60000,
      limit: 20,
      post_id: this.props.post_id,
    })
      .then((comments: IComment[]) => {

        if (comments.length === 20) {
          this.getAfterComments(true);
        }

        this.setState({
          comments: ArrayUntiles.uniqueObjects(comments.concat(this.state.comments), '_id')
            .sort((a: IComment, b: IComment) => {
              return a.timestamp - b.timestamp;
            }),
        });

        if (scrollToBottom) {
          document.body.scrollTop = document.body.scrollHeight - document.body.clientHeight;
        }
      });
  }

  /**
   * @func setScrollPositionOnId
   * @desc Scrolls body into an element with the given Id
   * @private
   * @param {string} id
   * @memberof CommentsBoard
   */
  private setScrollPositionOnId(id: string) {
    const elementOffsetBottom = document.documentElement.scrollHeight - document.getElementById(id).offsetHeight;

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop =
        document.documentElement.scrollHeight - elementOffsetBottom;
    }, 100);

  }

  /**
   * @func getBeforeComments
   * @desc Loads the comments that are older than the last comment of the board
   * @private
   * @memberof CommentsBoard
   */
  private getBeforeComments() {
    this.postApi.getComments({
      before: this.state.comments[0].timestamp,
      limit: 20,
      post_id: this.props.post_id,
    })
      .then((comments: IComment[]) => {

        if (comments.length < 20) {
          this.hasBeforeComments = false;
        }

        this.setScrollPositionOnId(this.state.comments[this.state.comments.length - 1]._id);

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
  private addComment() {
    this.setState({
      sendingComment: true,
    });
    const commentApi = new CommentApi();
    commentApi.addComment({
      post_id: this.props.post_id,
      txt: this.state.newCommentTxt,
    }).then(() => {
      this.setState({
        sendingComment: false,
        newCommentTxt: '',
      });
      this.getAfterComments(true);
    });
  }

  /**
   * @function handleChangeComment
   * @desc Updates the new comment text in the component state
   * @private
   * @param {*} e
   * @memberof CommentsBoard
   */
  private handleChangeComment(text: string) {

    this.setState({
      newCommentTxt: text,
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
            <UserAvatar user_id={comment.sender._id} size={24} borderRadius={'16px'}/>
            <div className={style.commentContent}>
              <div className={style.commentHead}>
                <a><FullName user_id={comment.sender._id}/></a>
                <span>{TimeUntiles.dynamic(comment.timestamp)}</span>
              </div>
              {comment.attachment_id === '' &&
                <p className={RTLDetector.getInstance().direction(comment.text) ? style.Rtl : ''}>{comment.text}</p>
              }
              {comment.attachment_id !== '' &&
                <VoiceComment comment={comment}/>
              }
            </div>
          </div>
        ))}
        {!this.props.no_comment && (
          <div className={style.commentInput}>
            <UserAvatar user_id={this.props.user} size={24} borderRadius={'16px'}/>
            <NstInput placeholder={'write your comment...'} value={this.state.newCommentTxt}
              onChange={this.handleChangeComment} disabled={this.state.sendingComment}
              onPressEnter={this.addComment.bind(this, '')} />
          </div>
        )}
      </div>
    );
  }
}

export default CommentsBoard;

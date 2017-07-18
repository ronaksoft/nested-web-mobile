import * as React from 'react';
import PostApi from '../../../../../api/post/index';
import IComment from '../../../../../api/comment/interfaces/IComment';
import {UserAvatar, FullName} from 'components';
import {Input} from 'antd';
import CommentApi from '../../../../../api/comment/index';
import ArrayUntiles from '../../../../../services/untils/array';
import TimeUntiles from '../../../../../services/untils/time';
import {IcoN} from 'components';
import IPost from '../../../../../api/post/interfaces/IPost';
import SyncActivity from '../../../../../services/syncActivity/index';
import SyncActions from '../../../../../services/syncActivity/syncActions';

const style = require('./comment-board.css');

interface IProps {
  post_id: string;
  post?: IPost;
  no_comment?: boolean;
}

interface IState {
  comments: IComment[];
  sendingComment: boolean;
  newCommentTxt: string;
}

class CommentsBoard extends React.Component<IProps, IState> {
  private postApi;
  private syncActivity = SyncActivity.getInstance();
  private syncActivityListeners = [];
  private hasBeforeComments: boolean = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      comments: [],
      sendingComment: false,
      newCommentTxt: '',
    };

    this.handleChangeComment = this.handleChangeComment.bind(this);

  }

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

  public componentWillUnmount() {
    // set sync listeners
    if (this.props.post) {
      this.syncActivityListeners.forEach((canceller) => {
        canceller();
      });
    }
  }

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

  private setScrollPositionOnId(id: string) {
    const elementOffsetBottom = document.documentElement.scrollHeight - document.getElementById(id).offsetHeight;

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop =
        document.documentElement.scrollHeight - elementOffsetBottom;
    }, 100);

  }

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

  private handleChangeComment(e: any) {

    this.setState({
      newCommentTxt: e.target.value,
    });
  }

  public render() {
    return (
      <div className={style.commentBoard} id={'comment-board'}>
        {
          this.hasBeforeComments && (
            <div id={'load-older-comments'} className={style.loadMore}
                 onClick={this.getBeforeComments.bind(this, '')}
            >
              <IcoN size={16} name={'comment24'}/>
              Load older comments
            </div>
          )
        }
        {this.state.comments.map((comment: IComment) => (
          <div id={comment._id} className={style.commentRow}>
            <UserAvatar user_id={comment.sender._id} size={24} borderRadius={'16px'}/>
            <div className={style.commentContent}>
              <div className={style.commentHead}>
                <a><FullName user_id={comment.sender._id}/></a>
                <span>{TimeUntiles.dynamic(comment.timestamp)}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
        {!this.props.no_comment && (
          <div className={style.commentInput}>
            <UserAvatar user_id={'robzizo'} size={24} borderRadius={'16px'}/>
            <Input
              placeholder={'write your comment...'}
              value={this.state.newCommentTxt}
              onChange={this.handleChangeComment}
              disabled={this.state.sendingComment}
              onPressEnter={this.addComment.bind(this, '')}/>
          </div>
        )}
      </div>
    );
  }
}

export default CommentsBoard;

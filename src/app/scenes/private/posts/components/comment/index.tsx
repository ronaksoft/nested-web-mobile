import * as React from 'react';
import PostApi from '../../../../../api/post/index';
import IComment from '../../../../../api/comment/interfaces/IComment';
import {UserAvatar, FullName} from 'components';
import {Input} from 'antd';
import CommentApi from '../../../../../api/comment/index';
import ArrayUntiles from '../../../../../services/untils/array';
import TimeUntiles from '../../../../../services/untils/time';

interface IProps {
  post_id: string;
}

interface IState {
  comments: IComment[];
  sendingComment: boolean;
  newCommentTxt: string;
}

class CommentsBoard extends React.Component<IProps, IState> {
  private postApi;
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
          document.getElementById('comment-board').scrollIntoView(false);
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
      <div id={'comment-board'}>
        {this.hasBeforeComments &&
        <div id={'load-older-comments'} onClick={this.getBeforeComments.bind(this, '')}>
          Load older comments
        </div>
        }
        <Input
          style={{
            position: 'fixed',
            bottom: 0,
          }}
          placeholder={'write your comment...'}
          value={this.state.newCommentTxt}
          onChange={this.handleChangeComment}
          disabled={this.state.sendingComment}
          onPressEnter={this.addComment.bind(this, '')}/>
        {this.state.comments.map((comment: IComment) => (
          <div id={comment._id}>
            <UserAvatar user_id={comment.sender._id} size={32} borderRadius={'16px'}/>
            <b><FullName user_id={comment.sender._id}/></b>
            <div>{comment.text}</div>
            <div>{TimeUntiles.dynamic(comment.timestamp)}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default CommentsBoard;

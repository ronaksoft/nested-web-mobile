import * as React from 'react';
import IComment from '../../api/comment/interfaces/IComment';
import {commentAdd} from '../../redux/comments/actions/index';
import CommentApi from '../../api/comment/index';
import {connect} from 'react-redux';

interface IOwnProps {
  comment_id: string;
  post_id: string;
}

interface IProps {
  post_id: string;
  comment_id: string;
  comments: IComment[];
  commentAdd: (comment: IComment) => {};
}

interface IState {
  comment: IComment | null;
}

class CommentBody extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      comment: null,
    };
  }

  public componentDidMount() {
    const comments = this.props.comments.filter((comment: IComment) => {
      return comment.id === this.props.comment_id;
    });

    if (comments.length > 0) {
      this.setState({
        comment: comments[0],
      });
    } else {
      const commentApi = new CommentApi();
      commentApi.get(
        {
          comment_id: this.props.comment_id,
          post_id: this.props.post_id,
        })
        .then((comment: IComment) => {
          this.setState({
            comment,
          });
          this.props.commentAdd(comment);
        });
    }
  }

  public render() {

    const {comment} = this.state;
    if (!comment) {
      return null;
    }
    return (
      <span>{comment.text}</span>
    );
  }
}

const mapStateToProps = (store, ownProps: IOwnProps) => ({
  comments: store.comments.comments,
  comment_id: ownProps.comment_id,
});

const mapDispatchAction = (dispatch) => {
  return {
    commentAdd: (comment: IComment) => {
      dispatch(commentAdd(comment));
    },
  };
};

export default connect(mapStateToProps, mapDispatchAction)(CommentBody);

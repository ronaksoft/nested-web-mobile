import * as React from 'react';
import IComment from '../../api/comment/interfaces/IComment';
import {commentAdd} from '../../redux/comments/actions/index';
import CommentApi from '../../api/comment/index';
import {connect} from 'react-redux';

interface IOwnProps {
  com_id: string;
}
interface IProps {
  com_id: string;
  comments: IComment[];
  commentAdd: (comment: IComment) => {};
}

interface IState {
 com: IComment | null;
}

class CommentBody extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      com: null,
    };
  }

  public componentDidMount() {
    const com = this.props.comments.filter((com: IComment) => {
      return com.id === this.props.com_id;
    });

    if (com.length > 0) {
      this.setState({
        com: com[0],
      });
    } else {
      const commentApi = new CommentApi();
      commentApi.get({comment_id: this.props.com_id})
        .then((comment: IComment) => {
          this.setState({
            com: comment,
          });
          this.props.commentAdd(comment);
        });
    }
  }

  public render() {

    const {com} = this.state;

    if (!com) {
      return null;
    }
    return (
      <span>{com.body}</span>
    );
  }
}
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  comments: store.comments.comments,
  com_id: ownProps.com_id,
});

const mapDispatchAction = (dispatch) => {
  return {
    commentAdd: (comment: IComment) => dispatch(commentAdd(comment)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(CommentBody);

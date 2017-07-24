/**
 * @file component/CommentBody/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the comment text where we need it.
 * in this component we store comments in redux. Component get requiered data directly from store or api call.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : -
 * Date of review : -
 */
import * as React from 'react';
import IComment from '../../api/comment/interfaces/IComment';
import {commentAdd} from '../../redux/comments/actions/index';
import CommentApi from '../../api/comment/index';
import {connect} from 'react-redux';

/**
 *
 * @implements
 * @interface IOwnProps
 */
interface IOwnProps {
  comment_id: string;
  post_id: string;
}

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  post_id: string;
  comment_id: string;
  comments: IComment[];
  commentAdd: (comment: IComment) => {};
}

/**
 *
 * @implements
 * @interface IState
 */
interface IState {
  comment: IComment | null;
}
/**
 * renders the PostSubject element
 * @class CommentBody
 * @extends {React.Component<IProps, IState>}
 */
class CommentBody extends React.Component<IProps, IState> {
  /**
   * Constructor
   * Creates an instance of CommentBody.
   * @param {IProps} props
   * @memberof CommentBody
   */
  constructor(props: any) {
    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      comment: null,
    };
  }
  /**
   * Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof CommentBody
   */
  public componentDidMount() {
    // search redux store for any comment which has the same id with props id
    const comments = this.props.comments.filter((comment: IComment) => {
      return comment._id === this.props.comment_id;
    });
    // determine comment is stored in redux already
    if (comments.length > 0) {
      this.setState({
        comment: comments[0],
      });
    } else {
      // define the comment Api
      const commentApi = new CommentApi();
      // call comment Api for get comments
      // recieve comments with declared `comment_id` and `post_id`
      commentApi.get(
        {
          comment_id: this.props.comment_id,
          post_id: this.props.post_id,
        })
        .then((comment: IComment) => {
          this.setState({
            comment,
          });
          // store comment in redux store
          this.props.commentAdd(comment);
        });
    }
  }
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof CommentBody
   * @generator
   */
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
/**
 * redux store mapper
 * @param store
 * @param ownProps
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  comments: store.comments.comments,
  comment_id: ownProps.comment_id,
});
/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchAction = (dispatch) => {
  return {
    commentAdd: (comment: IComment) => {
      dispatch(commentAdd(comment));
    },
  };
};

export default connect(mapStateToProps, mapDispatchAction)(CommentBody);

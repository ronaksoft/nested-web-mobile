/**
 * @file component/PostSubject/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the post subject where we need it.
 * in this component we store posts in redux. Component get requiered data directly from store or api call.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : -
 * Date of review : -
 */
import * as React from 'react';
import IPost from '../../api/post/interfaces/IPost';
import {postAdd} from '../../redux/posts/actions/index';
import PostApi from '../../api/post/index';
import {connect} from 'react-redux';

interface IOwnProps {
  /**
   * @property post_id
   * @desc Includes `post_id` of posts
   * @type {string}
   * @memberof IOwnProps
   */
  post_id: string;
}

interface IProps {
  /**
   * @property post_id
   * @desc Includes `post_id` of posts
   * @type {string}
   * @memberof IProps
   */
  post_id: string;
  /**
   * @property posts
   * @desc Includes posts as an array of IPost
   * @type {array}
   * @memberof IProps
   */
  posts: IPost[];
  /**
   * @property postAdd
   * @desc Includes postAdd as a function
   * @type {function}
   * @memberof IProps
   */
  postAdd: (post: IPost) => {};
}

interface IState {
  /**
   * @property post
   * @desc Includes data of each post
   * @type {object}
   * @memberof IState
   */
  post: IPost | null;
}

/**
 * renders the PostSubject element
 * @class PostSubject
 * @classdesc Component renders the PostSubject html element as an span
 * @extends {React.Component<IProps, IState>}
 */
class PostSubject extends React.Component<IProps, IState> {
  /**
   * Constructor
   * Creates an instance of PostSubject.
   * @param {IProps} props
   * @memberof PostSubject
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      post: null,
    };
  }
  /**
   * Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof PostSubject
   * @override
   */
  public postDidMount() {
    /**
     * search redux store for any post which has the same id with props id
     */
    const posts = this.props.posts.filter((post: IPost) => {
      return post._id === this.props.post_id;
    });
    /**
     * determine post is stored in redux already
     */
    if (posts.length > 0) {
      this.setState({
        post: posts[0],
      });
    } else {
      /**
       * define the post Api
       */
      const postApi = new PostApi();
      /**
       * call post Api for get posts
       * recieve posts with declared `post_id`
       */
      postApi.get({post_id: this.props.post_id})
        .then((post: IPost) => {
          this.setState({
            post,
          });
          /**
           * store post in redux store
           */
          this.props.postAdd(post);
        });
    }
  }
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof PostSubject
   * @generator
   */
  public render() {

    const {post} = this.state;
    if (!post) {
      return null;
    }
    return (
      <span>{post.subject}</span>
    );
  }
}
/**
 * redux store mapper
 * @param store
 * @param ownProps
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  posts: store.posts.posts,
  post_id: ownProps.post_id,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchAction = (dispatch) => {
  return {
    postAdd: (post: IPost) => {
      dispatch(postAdd(post));
    },
  };
};

export default connect(mapStateToProps, mapDispatchAction)(PostSubject);

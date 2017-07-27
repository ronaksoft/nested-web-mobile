/**
 * @bookmarked scenes/private/posts/bookmarked/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering posts which are bookmarked.
 * Documented by:          Shayesteh Naeimabadi <naamesteh@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            -
 * Date of review:         -
 */
import * as React from 'react';
import {OptionsMenu} from 'components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../../api/post/index';
import IPost from '../../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../../api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts, setPostsRoute} from '../../../../redux/app/actions/index';
import ArrayUntiles from '../../../../services/untils/array';
import {Button, message} from 'antd';
import Post from '../components/post/index';
import {browserHistory} from 'react-router';
import {Loading} from '../../../../components/Loading/index';

const style = require('../posts.css');

/**
 * @interface IProps
 */
interface IProps {
  /**
   * @property postsRoute
   * @desc  posts route that the message is going to it
   * @type {string}
   * @memberof IProps
   */
  postsRoute: string;
  /**
   * @property routing
   * @desc routing
   * @type {any}
   * @memberof IProps
   */
  routing: any;
  /**
   * @property posts
   * @desc  array of posts data objects
   * @type {array}
   * @memberof IProps
   */
  posts: IPost[];
  /**
   * @property currentPost
   * @desc object of current post data
   * @type {object}
   * @memberof IProps
   */
  currentPost: IPost | null;
  /**
   * @property setPosts
   * @desc setPosts action which send posts based on IPost[] interface to store
   * @type {function}
   * @memberof IProps
   */
  setPosts: (posts: IPost[]) => {};
  /**
   * @property postsRoute
   * @desc setPostsRoute action which send posts's route based on route param to store
   * @type {function}
   * @memberof IProps
   */
  setPostsRoute: (route: string) => {};
  /**
   * @property setCurrentPost
   * @desc  setCurrentPost action which send current post based on IPost[] interface to store
   * @type {function}
   * @memberof IProps
   */
  setCurrentPost: (post: IPost) => {};
  /**
   * @property params
   * @desc params property
   * @type {any}
   * @memberof IProps
   */
  params?: any;
  /**
   * @property location
   * @desc location property
   * @type {any}
   * @memberof IProps
   */
  location: any;
}
/**
 * @interface IState
 */
interface IState {
  /**
   * @property posts
   * @desc  array of posts data objects
   * @type {array}
   * @memberof IState
   */
  posts: IPost[];
  /**
   * @property loadingAfter
   * @desc  loading posts after
   * @type {boolean}
   * @memberof IState
   */
  loadingAfter: boolean;
  /**
   * @property loadingBefore
   * @desc  loading posts before
   * @type {boolean}
   * @memberof IState
   */
  loadingBefore: boolean;
  /**
   * @property reachedTheEnd
   * @desc reached to end of posts
   * @type {boolean}
   * @memberof IState
   */
  reachedTheEnd: boolean;
}

/**
 * @class Bookmarked
 * @classdesc Component renders the Bookmarked posts
 * @extends {React.Component<IProps, IState>}
 */
class Bookmarked extends React.Component<IProps, IState> {
  private postApi: PostApi;
  /**
   * Creates an instance of Bookmarked.
   * @param {*} props
   * @memberof Bookmarked
   */
  constructor(props: IProps) {
    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      posts: this.props.location.pathname === this.props.postsRoute ? this.props.posts : [],
      loadingAfter: false,
      loadingBefore: false,
      reachedTheEnd: false,
    };
  }
  /**
   * updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Bookmarked
   */
  public componentWillReceiveProps(newProps: IProps) {
    this.setState({posts: newProps.posts});
  }
  /**
   * Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof Bookmarked
   * @override
   */
  public componentDidMount() {
    /**
     * define the Post Api
     */
    this.postApi = new PostApi();
    this.getPost(true);
    /**
     * handle window scroll in current post case
     */
    if (this.props.currentPost) {
      setTimeout(() => {
          window.scrollTo(0, this.getOffset(this.props.currentPost._id).top - 400);
        },
        200);
    }

  }

  /**
   * @function getPost
   * @desc Get posts with declared limits and before timestamp of
   * the latest post item in state, otherwise the current timestamp.
   * @param fromNow
   * @param after
   * @private
   */
  private getPost(fromNow?: boolean, after?: number) {

    let params: IPostsListRequest;
    if (fromNow === true) {
      params = {
        before: Date.now(),
      };
      this.setState({
        loadingBefore: true,
      });
    } else if (typeof after === 'number') {
      params = {
        after,
      };
      this.setState({
        loadingAfter: true,
      });
    } else {
      this.setState({
        loadingBefore: true,
      });
      if (this.state.posts.length === 0) {
        params = {
          before: Date.now(),
        };
      } else {
        params = {
          before: this.state.posts[this.state.posts.length - 1].timestamp,
        };
      }
    }
    params.limit = 20;
    this.postApi.getBockmarkedPosts(params)
      .then((response: IPostsListResponse) => {

        if (this.state.posts.length > 0 && response.posts.length < params.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }
        /**
         * concat received post items with current items and unique array by identifiers
         * and sorting the post items by date
         * @type {any[]}
         */
        const posts = ArrayUntiles.uniqueObjects(response.posts.concat(this.state.posts), '_id')
          .sort((a: IPost, b: IPost) => {
            return b.timestamp - a.timestamp;
          });

        if (fromNow === true) {
          this.props.setPosts(posts);
          this.props.setPostsRoute(this.props.location.pathname);
        }

        this.setState({
          posts,
          loadingBefore: false,
          loadingAfter: false,
        });
      })
      .catch(() => {
        message.success('An error has occurred.', 10);
      });
  }

  /**
   * @param id
   * @returns {{left: number, top: number}}
   * @private
   */
  private getOffset(id: string) {
    const el = document.getElementById(id).getBoundingClientRect();
    return {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
    };
  }

  /**
   * @param post
   * @private
   */
  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    browserHistory.push(`/message/${post._id}`);
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Bookmarked
   * @generator
   */
  public render() {
    const loadMore = this.getPost.bind(this);

    const leftItem = {
      name: 'Bookmarked',
      type: 'title',
      menu: [],
    };

    const rightMenu = [];

    return (
      <div className={style.container}>
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <Loading active={this.state.loadingAfter} />
        {this.state.posts.map((post: IPost) => (
          <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
            <Post post={post}/>
          </div>))}
        <Loading active={this.state.loadingBefore}/>
        {
          !this.state.reachedTheEnd &&
          !this.state.loadingAfter &&
          !this.state.loadingBefore &&
          this.state.posts.length === 0 &&
          (
            <div>
              <b>You haven't bookmarked anything yet!</b>
              <div>There's a bookmark icon on the upper-right corner of each post.</div>
              Click on it to save the post to be viewed later.
              <div>
                <Button onClick={loadMore}>Try again</Button>
              </div>
            </div>
          )
        }
        {this.state.reachedTheEnd &&
        <div>No more messages here!</div>
        }
        {!this.state.reachedTheEnd &&
        !this.state.loadingBefore && !this.state.loadingAfter &&
        <div><Button onClick={loadMore}>Load More</Button></div>
        }
      </div>
    );
  }
}
/**
 * redux store mapper
 * @param store
 */

const mapStateToProps = (store) => ({
  postsRoute: store.app.postsRoute,
  posts: store.app.posts,
  currentPost: store.app.currentPost,
});
/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setPosts: (posts: IPost[]) => {
      dispatch(setPosts(posts));
    },
    setCurrentPost: (post: IPost) => {
      dispatch(setCurrentPost(post));
    },
    setPostsRoute: (route: string) => {
      dispatch(setPostsRoute(route));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarked);

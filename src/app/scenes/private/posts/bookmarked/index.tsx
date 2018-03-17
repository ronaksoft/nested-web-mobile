/**
 * @file scenes/private/posts/bookmarked/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering posts which are bookmarked.
 * Documented by:          Shayesteh Naeimabadi <naamesteh@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            sina hosseini <ehosseiniir@gmail.com>
 * Date of review:         2107-07-27
 */
import * as React from 'react';
import {OptionsMenu, InfiniteScroll, Loading} from 'components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../../api/post/index';
import IPost from '../../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../../api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts, setPostsRoute} from '../../../../redux/app/actions/index';
import ArrayUntiles from '../../../../services/utils/array';
import {Button, message} from 'antd';
import Post from '../components/post/index';
import {hashHistory} from 'react-router';

const privateStyle = require('../../private.css');
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
   * @desc routing state receive from react-router-redux
   * @type {any}
   * @memberof IProps
   */
  // fixme:: set type
  routing: any;
  /**
   * @property posts
   * @desc  list of posts (IPost) that stored in redux store
   * @type {array<IPost>}
   * @memberof IProps
   */
  posts: IPost[];
  /**
   * @property currentPost
   * @desc object of current post
   * @type {IPost | null}
   * @memberof IProps
   */
  currentPost: IPost | null;
  /**
   * @property setPosts
   * @desc setPosts action which store a list of IPost objects in redux store
   * @type {function}
   * @memberof IProps
   */
  setPosts: (posts: IPost[]) => {};
  /**
   * @property setPostsRoute
   * @desc setPostsRoute action which store route of stored posts in redux store
   * @type {function}
   * @memberof IProps
   */
  setPostsRoute: (route: string) => {};
  /**
   * @property setCurrentPost
   * @desc  setCurrentPost action which store current post in redux store
   * @type {function}
   * @memberof IProps
   */
  setCurrentPost: (post: IPost) => {};
  /**
   * @property params
   * @desc parameters that received from route (react-router)
   * @type {any}
   * @memberof IProps
   */
  params?: any;
  /**
   * @property location
   * @desc location object that received from react-router
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
   * @desc  list of posts (IPost) that stored in redux store
   * @type {array<IPost>}
   * @memberof IState
   */
  posts: IPost[];
  /**
   * @property loadingAfter
   * @desc  display loading in top if `loadingAfter` in post list is true
   * @type {boolean}
   * @memberof IState
   */
  loadingAfter: boolean;
  /**
   * @property loadingBefore
   * @desc  display loading in bottom if `loadingBefore` in post list is true
   * @type {boolean}
   * @memberof IState
   */
  loadingBefore: boolean;
  /**
   * @property reachedTheEnd
   * @desc hide loading if `reachedTheEnd` is true
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
      // if postsRoute is equal to current path, stored posts in redux set as component state posts
      posts: this.props.location.pathname === this.props.postsRoute ? this.props.posts : [],
      loadingAfter: false,
      loadingBefore: false,
      reachedTheEnd: false,
    };
  }

  /**
   * @desc updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Bookmarked
   */
  public componentWillReceiveProps(newProps: IProps) {
    // set state posts by received post from new props
    this.setState({posts: newProps.posts});
  }

  /**
   * Component Did Mount
   * @desc Get post from redux store
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

  }

  /**
   * @function getPost
   * @desc Get posts with declared limits and `before` timestamp of
   * the latest post item in state, otherwise the current timestamp.
   * @param {boolean} fromNow receive post from now (set Date.now for `before`)
   * @param {number} after after timestamp
   * @private
   */
  private getPost(fromNow?: boolean, after?: number) {

    let params: IPostsListRequest;
    if (fromNow === true) {
      params = {
        before: Date.now(),
      };
      // show bottom loading
      this.setState({
        loadingBefore: true,
      });
    } else if (typeof after === 'number') {
      params = {
        after,
      };
      // show top loading
      this.setState({
        loadingAfter: true,
      });
    } else {
      // show bottom loading
      this.setState({
        loadingBefore: true,
      });
      /**
       * check state posts length for state `before` timestamp
       */
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

    // set get post limit
    // FIXME:: set limit from config
    params.limit = 20;

    // call get bookmarked posts
    this.postApi.getBockmarkedPosts(params)
      .then((response: IPostsListResponse) => {

        // if length of received post is less than limit, set `reachedTheEnd` as true
        if (this.state.posts.length > 0 && response.posts.length < params.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }

        /**
         * concat received post items with current items and unique array by identifiers (`_id`)
         * and sorting the post items by date
         * @type {IPost[]}
         */
        const posts: IPost[] = ArrayUntiles.uniqueObjects(response.posts.concat(this.state.posts), '_id')
          .sort((a: IPost, b: IPost) => {
            return b.timestamp - a.timestamp;
          });

        // store current state post and route in redux store, if `fromNow` was true
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

  private refresh = () => {
    this.getPost(true);
  }

  /**
   * @function gotoPost
   * @desc Go to pst route by its `post_id`
   * @param {IPost} post
   * @private
   */
  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    hashHistory.push(`/message/${post._id}`);
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Bookmarked
   * @generator
   */
  public render() {
    const loadMore = this.getPost.bind(this);
    /**
     * @name leftItem
     * @const
     * @type {object}
     */
    const leftItem = {
      name: 'Bookmarked',
      type: 'title',
      menu: [],
    };
    /**
     * @name rightMenu
     * @const
     * @type {array}
     */
    const rightMenu = [];

    return (
      <div className={style.container}>
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <div className={privateStyle.postsArea}>
          {this.state.posts.length > 0 && (
            <InfiniteScroll
              pullDownToRefresh={true}
              refreshFunction={this.refresh}
              next={loadMore}
              route={this.props.location.pathname}
              hasMore={true}
              loader={<Loading active={true} position="fixed"/>}>
                
                {/* after Loading component render posts list */}
                {this.state.posts.map((post: IPost) => (
                  <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
                    <Post post={post}/>
                  </div>
                ))}
                {/* rendering following text when there is no post */}
                {
                  !this.state.reachedTheEnd &&
                  !this.state.loadingAfter &&
                  !this.state.loadingBefore &&
                  this.state.posts.length === 0 &&
                  (
                    <div className={privateStyle.emptyMessage}>
                      <b>You haven't bookmarked anything yet!</b>
                      <div>There's a bookmark icon on the upper-right corner of each post.</div>
                      Click on it to save the post to be viewed later.
                      <div>
                        {/* Try again button */}
                        <Button onClick={loadMore}>Try again</Button>
                      </div>
                    </div>
                  )
                }
                {/* rendering following text in `reachedTheEnd` case */}
                {this.state.reachedTheEnd &&
                <div className={privateStyle.emptyMessage}>No more messages here!</div>
                }
                <div className={privateStyle.bottomSpace}/>
            </InfiniteScroll>
          )}
        </div>
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

/**
 * @file scenes/private/posts/feed/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering posts which are bookmarked.
 * Documented by:          Shayesteh Naeimabadi <naamesteh@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import {InfiniteScroll, Loading} from 'components';
import {connect} from 'react-redux';
import IPostsListRequest from 'api/post/interfaces/IPostsListRequest';
import PostApi from 'api/post/index';
import placeApi from 'api/place/index';
import IPost from 'api/post/interfaces/IPost';
import IPostsListResponse from 'api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts, setPostsRoute} from '../../../redux/app/actions/index';
import {postAdd} from '../../../redux/posts/actions/index';
import ArrayUntiles from 'services/utils/array';
import {Button, message, Modal} from 'antd';
import Post from './components/post/index';
import {hashHistory} from 'react-router';
import SyncPlaceActivity from 'services/sync-place-activity/index';
import SyncPlaceActions from 'services/sync-place-activity/actions';
import SyncPostActivity from 'services/sync-post-activity/index';
import SyncPostActions from 'services/sync-post-activity/actions';
import {IPlaceActivity, IPostActivity, IUser} from 'api/interfaces/';
import AccountApi from 'api/account/index';
import {NewBadge} from 'components/NewBadge';
import IErrorResponseData from 'services/server/interfaces/IErrorResponseData';
import Failure from 'services/server/failure';

const style = require('./posts.css');
const privateStyle = require('../private.css');

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
  posts: IPost[] | any;
  postsDirectory: any;
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
  setPosts: (posts: IPost[] | any) => {};
  postAdd: (post: IPost | IPost[]) => {};
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
  user: IUser;
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
   * @desc hide loading  if `reachedTheEnd` is true
   * @type {boolean}
   * @memberof IState
   */
  reachedTheEnd: boolean;
  /**
   * @property newPostCount
   * @desc display new post count badge when receive a new post
   * @type {boolean}
   * @memberof IState
   */
  newPostCount: number;
  route: string;
  location: any;
  initialLoading: boolean;
  getPinnedPosts: boolean;
}

/**
 * @class Feed
 * @classdesc Component renders the Feed posts page
 * @extends {React.Component<IProps, IState>}
 */
class Posts extends React.Component<IProps, IState> {
  private currentPlaceId: string | null;

  // (needs documentation)
  private postApi: PostApi;
  private placeApi: placeApi;
  private syncPlaceActivity = SyncPlaceActivity.getInstance();
  private syncPostActivity = SyncPostActivity.getInstance();
  private syncActivityListeners = [];
  private favoritePlacesId = [];
  private newPostsIds = [];

  /**
   * Creates an instance of Feed.
   * @constructor
   * @param {*} props
   * @memberof Feed
   */
  constructor(props: IProps) {

    super(props);
    const initiateRoute = this.findRouteFromPath(props);
    let reduxPosts = this.props.posts[initiateRoute] || [];
    if (reduxPosts.length > 0) {
      reduxPosts = reduxPosts.map((postId) => this.props.postsDirectory[postId]);
    }
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      // if postsRoute is equal to current path, stored posts in redux set as component state posts
      posts: reduxPosts,
      loadingAfter: false,
      loadingBefore: false,
      reachedTheEnd: false,
      getPinnedPosts: false,
      initialLoading: true,
      newPostCount: 0,
      location: this.props.location.pathname,
      route: initiateRoute || 'feed',
    };
  }

  /**
   * @desc updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Feed
   */
  public componentWillReceiveProps(newProps: IProps) {
    const route = this.findRouteFromPath(newProps);
    const thisRoutePosts = newProps.posts[route];
    const state: any = {
      posts: thisRoutePosts ? thisRoutePosts.map((postId) => this.props.postsDirectory[postId]) : [],
      location: newProps.location.pathname,
      route,
    };
    const pageIsChanged = this.state.route !== route;
    if (pageIsChanged) {
      state.initialLoading = true;
      if (state.posts.length === 0) {
        state.getPinnedPosts = false;
      }
    }
    this.setState(state, () => {
      if (pageIsChanged) {
        this.getPosts(true);
      }
    });
  }

  private updatePostsInStore(postId: string, key: string, value: any) {

    const posts = JSON.parse(JSON.stringify(this.props.posts));
    let newPosts;
    if (!Array.isArray(posts)) {
      return;
    }
    newPosts = posts.map((post: IPost) => {
      if (post._id === postId) {
        post[key] = value;
      }
      return post;
    });

    this.props.setPosts(newPosts.map((post) => post._id));

  }

  public findRouteFromPath(newProps) {
    switch (newProps.location.pathname) {
      case '/feed':
        return 'feed';
      case '/feed/latest-activity':
        return 'feed_latest_activity';

      case '/shared':
        return 'shared';
      case '/bookmarks':
        return 'bookmarks';

      default:
        const routeSplit = newProps.location.pathname.split('/');
        const placeId = routeSplit[2];
        this.currentPlaceId = placeId;
        if (routeSplit[4] && routeSplit[4] === 'latest-activity') {
          return 'place_latest_activity_' + placeId;
        } else if (routeSplit[3] === 'unread') {
          return 'place_unread_' + placeId;
        } else {
          return 'place_' + placeId;
        }
    }
  }

  /**
   * Component Did Mount ( what ?!)
   * @desc Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof Feed
   * @override
   */
  public componentDidMount() {
    /**
     * define the Post Api
     */
    this.postApi = new PostApi();
    this.placeApi = new placeApi();
    this.getFavPlaces();
    this.getPosts(true);

    // Needs documentation
    this.syncActivityListeners.push(
      this.syncPlaceActivity.openAllChannel(
        (activity: IPlaceActivity) => {
          switch (activity.action) {
            case SyncPlaceActions.POST_ADD:
              return this.addNewPostActivity(activity);
            default :
              return;
          }
        },
      ));

    // Needs documentation
    this.syncActivityListeners.push(
      this.syncPostActivity.openAllChannel(
        (activity: IPostActivity) => {
          switch (activity.action) {
            case SyncPostActions.COMMENT_ADD:
            case SyncPostActions.COMMENT_REMOVE:
              return this.addCommentToPostActivity(activity);
            default :
              return;
          }
        },
      ));
  }

  public getFavPlaces() {
    /**
     * define the account Api
     */
    const accountApi = new AccountApi();
    accountApi.getFavoritePlaces()
      .then((placesId: string[]) => {
        this.favoritePlacesId = placesId;
      });
  }

  /**
   * @function addNewPostActivity
   * @desc add new post by activity sort
   * @param {IActivity} activity
   * @private
   */
  private addNewPostActivity(activity: IPlaceActivity) {
    if (
      this.favoritePlacesId.filter((placeId) => placeId === activity.place_id).length > 0 &&
      this.newPostsIds.filter((postId) => postId === activity.post_id).length === 0
    ) {
      this.newPostsIds.push(activity.post_id);
      this.setState({
        newPostCount: this.newPostsIds.length,
      });
    }
  }

  /**
   * @function addCommentToPostActivity
   * @desc add comment to post activity sort ( unclear )
   * @param {IActivity} activity
   * @private
   */
  private addCommentToPostActivity(activity: IPlaceActivity) {

    const indexOfPost = this.state.posts.findIndex((post: IPost) => (post._id === activity.post_id));

    if (indexOfPost > -1) {
      let posts;
      posts = JSON.parse(JSON.stringify(this.state.posts));
      // call get posts
      this.postApi.get({post_id: activity.post_id})
        .then((post: IPost) => {
          posts[indexOfPost].counters = post.counters;
          this.setState({
            posts,
          });
          this.props.setPosts(posts);
        });
    }
  }

  /**
   * @function getPost
   * @desc Get posts with declared limits and `before` timestamp of
   * the latest post item in state, otherwise the current timestamp.
   * @param {boolean} fromNow receive post from now (set Date.now for `before`)
   * @param {number} after after timestamp
   * @private
   */
  private getPosts(fromNow?: boolean, after?: number) {
    let params: IPostsListRequest;
    let fnName: string = 'getFavoritePosts';
    let requirePinnedMessages: boolean = false;
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
    params.limit = 20;

    if (this.state.route.indexOf('latest_activity') > -1) {
      params.by_update = true;
    }

    if (this.state.route.indexOf('bookmarks') > -1) {
      fnName = 'getBockmarkedPosts';
    }

    if (this.state.route.indexOf('shared') > -1) {
      fnName = 'getSentPosts';
    }

    if (this.state.route.indexOf('place') > -1) {
      fnName = 'getPlacePosts';
      params.place_id = this.currentPlaceId;
      requirePinnedMessages = true;
    }

    if (this.state.route.indexOf('unread') > -1) {
      fnName = 'getPlaceUnreadPosts';
      requirePinnedMessages = false;
    }
    // call get Favorite posts
    this.postApi[fnName](params)
      .then((response: IPostsListResponse) => {
        this.setState({
          loadingBefore: false,
          loadingAfter: false,
          initialLoading: false,
        });

        // if length of received post is less than limit, set `reachedTheEnd` as true
        if (response.posts.length < params.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }
        /**
         * concat received post items with current items and unique array by identifiers (`_id`)
         * and sorting the post items by date
         * @type {IPost[]}
         */
        let posts;
        if (fromNow) {
          posts = ArrayUntiles.uniqueObjects([...response.posts, ...this.state.posts], '_id');
        } else {
          posts = ArrayUntiles.uniqueObjects([...this.state.posts, ...response.posts], '_id');
        }
        // .sort((a: IPost, b: IPost) => {
        //   return b.timestamp - a.timestamp;
        // });
        const postsObj = {};
        postsObj[this.state.route] = posts.map((post) => post._id);
        this.props.postAdd(response.posts);
        this.props.setPosts(postsObj);
        this.props.setPostsRoute(this.props.location.pathname);
      })
      .catch((error: IErrorResponseData) => {
        message.success('An error has occurred.', 10);
        if (params.place_id) {
          if (error.err_code === Failure.ACCESS_DENIED
            || error.err_code === Failure.UNAVAILABLE
            || error.err_code === Failure.INVALID) {
            Modal.error({
              title: 'Error',
              content: 'Either the Place doesn\'t exist, or you haven\'t been permitted to enter the Place.',
              okText: 'Return',
              onOk: () => hashHistory.goBack(),
            });
          }
          console.log('====================================');
          console.log(error);
          console.log('====================================');
        }
        this.setState({
          loadingBefore: false,
          loadingAfter: false,
          initialLoading: false,
        });
      });

    if (requirePinnedMessages && fromNow) {
      this.placeApi.get(this.currentPlaceId).then((place) => {
        if (place.pinned_posts) {
          this.postApi.getMany({post_id: place.pinned_posts.join(',')}).then((response) => {
            let posts = response.posts;
            const statePosts = [...this.state.posts];
            statePosts.forEach((post, index) => {
              if (place.pinned_posts.indexOf(post._id) > -1) {
                statePosts.splice(index, 1);
              }
            });
            posts.forEach((post) => {
              post.pinnedInPlace = true;
            });
            posts = [...posts, ...statePosts];
            this.setState({
              posts,
              getPinnedPosts: true,
            });

            const postsObj = {};
            postsObj[this.state.route] = posts.map((post) => post._id);
            this.props.postAdd(posts);
            this.props.setPosts(postsObj);
            this.props.setPostsRoute(this.props.location.pathname);
          });
        } else {
          this.setState({
            getPinnedPosts: true,
          });
        }
      });
    } else {
      this.setState({
        getPinnedPosts: true,
      });
    }
  }

  /**
   * @function showNewPosts
   * @desc display new posts
   * @private
   */
  private showNewPosts() {
    // this.props.setPosts([]);
    this.getPosts(true);
    this.newPostsIds = [];
    this.setState({
      newPostCount: 0,
    });
  }

  private refresh = () => {
    this.getPosts(true);
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
    this.postApi.markAsRead(post._id);
    this.updatePostsInStore(post._id, 'post_read', true);
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Feed
   * @generator
   */
  public render() {
    const loadMore = this.getPosts.bind(this);
    const {route, getPinnedPosts} = this.state;

    const doms = this.state.posts.map((post: IPost) => (
      <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
        <Post post={post}/>
      </div>
    ));
    return (
      <div className={style.container}>
        {/* rendering NewBadge component in receiving new post case */}
        <NewBadge onClick={this.showNewPosts.bind(this, '')}
                  text="New Post"
                  count={this.state.newPostCount}
                  visibility={this.state.newPostCount > 0}/>
        {
          this.state.reachedTheEnd &&
          !this.state.loadingAfter &&
          !this.state.loadingBefore &&
          this.state.posts.length === 0 &&
          (
            <div className={privateStyle.emptyMessage}>
              {route.indexOf('feed') > -1 && <span>You have no message in your feed</span>}
              {(route.indexOf('place') > -1 && route.indexOf('unread') === -1) &&
              <span>This Place don't have any messages</span>
              }
              {route.indexOf('unread') > -1 && <span>You don't have any unread messages.</span>}
              {route === 'shared' && <span>You did not shared anything yet.</span>}
              {route === 'bookmarks' && (
                <span>You haven't bookmarked anything yet!<br/>
                  There's a bookmark icon on the upper-right corner of each post.<br/>
                  Click on it to save the post to be viewed later.</span>
              )}
              <div className={style.loadMore}>
                <Button onClick={loadMore}>Try again</Button>
              </div>
            </div>
          )
        }
        <Loading position="absolute" active={this.state.initialLoading || !getPinnedPosts}/>
        <div className={privateStyle.postsArea}>
          {(this.state.posts.length > 0 && getPinnedPosts) && (
            <InfiniteScroll
              pullDownToRefresh={true}
              pullLoading={this.state.loadingBefore || this.state.loadingAfter}
              refreshFunction={this.refresh}
              next={loadMore}
              route={route}
              hasMore={!this.state.reachedTheEnd}
              loader={<Loading active={!this.state.reachedTheEnd} position="fixed"/>}>
              {doms}
              {this.state.reachedTheEnd &&
              <div className={privateStyle.emptyMessage}>No more messages here!</div>
              }
              {
                !this.state.reachedTheEnd &&
                !this.state.loadingBefore &&
                !this.state.loadingAfter && (
                  <div className={privateStyle.loadMore}>
                    {/* Load More button */}
                    <Button onClick={loadMore}>Load More</Button>
                  </div>
                )
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
  postsDirectory: store.posts,
  currentPost: store.app.currentPost,
  user: store.app.user,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    postAdd: (post: IPost | IPost[]) => {
      dispatch(postAdd(post));
    },
    setPosts: (posts: string[]) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Posts);

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
import {OptionsMenu} from 'components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../../api/post/index';
import IPost from '../../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../../api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts, setPostsRoute} from '../../../../redux/app/actions/index';
import ArrayUntiles from '../../../../services/utils/array';
import {Button, message} from 'antd';
import Post from '../components/post/index';
import {browserHistory} from 'react-router';
import SyncActivity from '../../../../services/syncActivity/index';
import IActivity from '../../../../api/activity/interfaces/IActivitiy';
import SyncActions from '../../../../services/syncActivity/syncActions';
import AccountApi from '../../../../api/account/index';
import {NewBadge} from 'components/NewBadge';
import {Loading} from '../../../../components/Loading/index';

const style = require('../posts.css');
const privateStyle = require('../../private.css');

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
}

/**
 * @class Feed
 * @classdesc Component renders the Feed posts page
 * @extends {React.Component<IProps, IState>}
 */
class Feed extends React.Component<IProps, IState> {
  // (needs documentation)
  private postApi: PostApi;
  private syncActivity = SyncActivity.getInstance();
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
      newPostCount: 0,
    };
  }

  /**
   * @desc updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Feed
   */
  public componentWillReceiveProps(newProps: IProps) {
    this.setState({posts: newProps.posts});
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
    this.getPost(true);
    /**
     * define the account Api
     */
    const accountApi = new AccountApi();
    accountApi.getFavoritePlaces()
      .then((placesId: string[]) => {
        this.favoritePlacesId = placesId;
      });
    /**
     * handle window scroll in current post after user return from a post view page
     * (by going to a post view page, selected post will store in `currentPost`)
     */
    if (this.props.currentPost) {
      setTimeout(() => {
          window.scrollTo(0, this.getOffset(this.props.currentPost._id).top - 400);
        },
        200);
    }

    // Needs documentation
    this.syncActivityListeners.push(
      this.syncActivity.openAllChannel(
        (activity: IActivity) => {
          switch (activity.action) {
            case SyncActions.COMMENT_ADD:
            case SyncActions.COMMENT_REMOVE:
              return this.addCommentToPostActivity(activity);
            case SyncActions.POST_ADD:
              return this.addNewPostActivity(activity);
            default :
              return;
          }
        },
      ));
  }

  /**
   * @function addNewPostActivity
   * @desc add new post by activity sort
   * @param {IActivity} activity
   * @private
   */
  private addNewPostActivity(activity: IActivity) {
    if (this.favoritePlacesId.filter((placeId) => (placeId === activity.place_id)).length === 0 &&
      this.newPostsIds.filter((postId) => (postId === activity.post_id)).length === 0) {
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
  private addCommentToPostActivity(activity: IActivity) {

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
   * @function gotoFeedByActivity
   * @desc set Feed sort by latest activity
   * @private
   */
  private gotoFeedByActivity() {
    browserHistory.push(`/m/feed/latest-activity`);
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
    // set get post limit ( unclear )
    // FIXME:: set limit from config
    params.limit = 20;
    // call get Favorite posts
    this.postApi.getFavoritePosts(params)
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
        const posts = ArrayUntiles.uniqueObjects(response.posts.concat(this.state.posts), '_id')
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
  /**
   * @function showNewPosts
   * @desc display new posts
   * @private
   */
  private showNewPosts() {
    this.props.setPosts([]);
    this.getPost();
    this.newPostsIds = [];
    this.setState({
      newPostCount: 0,
    });
  }
  /**
   * @function getOffset
   * @desc Get offset of post by `id` of html element
   * @param {string} id, id of html element
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
   * @function gotoPost
   * @desc Go to pst route by its `post_id`
   * @param {IPost} post
   * @private
   */
  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    browserHistory.push(`/m/message/${post._id}`);
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Feed
   * @generator
   */
  public render() {
    const loadMore = this.getPost.bind(this);
    /**
     * @name leftItem
     * @desc setting of left Item
     * @const
     * @type {object}
     */
    const leftItem = {
      name: 'Feed',
      type: 'title',
      menu: [],
    };
    /**
     * @name rightMenu
     * @desc settings of right menu
     * @const
     * @type {array}
     */
    const rightMenu = [
      {
        name: 'sort24',
        type: 'iconI',
        menu: [
          {
            onClick: null,
            name: 'Sort',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: null,
            name: 'Recent Posts',
            isChecked: true,
          },
          {
            onClick: this.gotoFeedByActivity,
            name: 'Latest Activity',
            isChecked: false,
          },
        ],
      },
    ];

    return (
      <div className={style.container}>
        {/* rendering NewBadge component in receiving new post case */}
        <NewBadge onClick={this.showNewPosts.bind(this, '')}
                  text="New Post"
                  count={this.state.newPostCount}
                  visibility={this.state.newPostCount > 0}/>
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        {/* rendering Loading component in  `loadingAfter` case */}
        <Loading active={this.state.loadingAfter}/>
        {this.state.loadingAfter &&
        <div>Loading new posts...</div>
        }
        {/* after Loading component render posts list */}
        {this.state.posts.map((post: IPost) => (
          <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
            <Post post={post}/>
          </div>))}
        {/* rendering Loading component in  `loadingBefore` case */}
        <Loading active={this.state.loadingBefore}/>
        {/* rendering following text when there is no post in Feed */}
        {
          !this.state.reachedTheEnd &&
          !this.state.loadingAfter &&
          !this.state.loadingBefore &&
          this.state.posts.length === 0 &&
          (
            <div>
              You have no message in your feed
              <div className={style.loadMore}>
                <Button onClick={loadMore}>Try again</Button>
              </div>
            </div>
          )
        }
        {this.state.reachedTheEnd &&
        <div>No more messages here!</div>
        }
        {!this.state.reachedTheEnd &&
        !this.state.loadingBefore && !this.state.loadingAfter && (
          <div className={privateStyle.loadMore}>
            {/* Load More button */}
            <Button onClick={loadMore}>Load More</Button>
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

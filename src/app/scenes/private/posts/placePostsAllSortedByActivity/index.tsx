/**
 * @file scenes/private/posts/PlacePostsAllSortedByActivity/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering posts which are bookmarked.
 * Documented by:          Shayesteh Naeimabadi <naamesteh@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            --
 * Date of review:         --
 */
import * as React from 'react';
import {OptionsMenu, PlaceName, InfiniteScroll, Loading, IcoN} from '../../../../components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../../api/post/index';
import IPost from '../../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../../api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts, setPostsRoute} from '../../../../redux/app/actions/index';
import ArrayUntiles from '../../../../services/utils/array';
import {Button} from 'antd';
import Post from '../components/post/index';
import {hashHistory} from 'react-router';
import SyncActivity from 'services/syncActivity';
import IActivity from '../../../../api/activity/interfaces/IActivitiy';
import SyncActions from '../../../../services/syncActivity/syncActions';
import {NewBadge} from '../../../../components/NewBadge/index';

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
 * @class PlacePostsAllSortedByActivity
 * @classdesc Component renders the Place posts by recent activity
 * @extends {React.Component<IProps, IState>}
 */
class PlacePostsAllSortedByActivity extends React.Component<IProps, IState> {
  private postApi: PostApi;
  private currentPlaceId: string | null;
  private syncActivity = SyncActivity.getInstance();
  private syncActivityListeners = [];
  private newPostsIds = [];
  /**
   * Creates an instance of PlacePostsAllSortedByActivity.
   * @param {*} props
   * @memberof PlacePostsAllSortedByActivity
   */
  constructor(props: IProps) {
    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.currentPlaceId = this.props.params.placeId;
    this.state = {
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
   * @memberof PlacePostsAllSortedByActivity
   */
  public componentWillReceiveProps(newProps: IProps) {
    if (newProps.params.placeId !== this.currentPlaceId) {
      this.currentPlaceId = this.props.params.placeId;
      this.getPost(true);
      this.setState({posts: []});
    } else {
      // fixme:: filter post by current place id
      this.setState({posts: newProps.posts});
    }
  }

  /**
   * @prop scrollWrapper
   * @desc Reference of  scroll element
   * @private
   * @type {HTMLDivElement}
   * @memberof PlacePostsAllSortedByActivity
   */
  private scrollWrapper: HTMLDivElement;

  private refHandler = (value) => {
    this.scrollWrapper = value;
  }
  /**
   * Component Did Mount
   * @desc Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof PlacePostsAllSortedByActivity
   * @override
   */
  public componentDidMount() {
    const isSafari = navigator.userAgent.toLowerCase().match(/(ipad|iphone)/);
    if ( this.scrollWrapper ) {
      if (isSafari) {
        this.scrollWrapper.addEventListener('touchmove', (e: any) => {
          e = e || window.event;
          e.stopImmediatePropagation();
          e.cancelBubble = true;
          e.stopPropagation();
          e.returnValue = true;
          return true;
        }, false);
        this.scrollWrapper.addEventListener('touchstart', (e: any) => {
          e = e || window.event;
          e.currentTarget.scrollTop += 1;
          e.stopImmediatePropagation();
          e.cancelBubble = true;
          e.stopPropagation();
          e.returnValue = true;
          return true;
        }, false);

      }
      this.scrollWrapper.addEventListener('scroll', (e: any) => {
        e = e || window.event;
        const el = e.currentTarget;
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();
        if (el.scrollTop === 0) {
            el.scrollTop = 1;
        } else if (el.scrollHeight === el.clientHeight + el.scrollTop) {
          el.scrollTop -= 1;
        }
        e.returnValue = true;
        return true;
      }, true);
    }
    if (this.props.params.placeId) {
      this.currentPlaceId = this.props.params.placeId;
    }
    /**
     * define the Post Api
     */
    this.postApi = new PostApi();
    this.getPost(true);

    this.syncActivityListeners.push(
      this.syncActivity.openChannel(
        this.currentPlaceId,
        SyncActions.ALL_ACTIONS,
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
    if (this.newPostsIds.filter((postId) => (postId === activity.post_id)).length === 0) {
      this.newPostsIds.push(activity.post_id);
      this.setState({
        newPostCount: this.newPostsIds.length,
      });
    }
  }
  /**
   * @function addCommentToPostActivity
   * @desc add comment to post activity sort
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
   * @function showNewPosts
   * @desc display new posts
   * @private
   */
  private showNewPosts() {
    this.props.setPosts([]);
    this.newPostsIds = [];
    this.setState({
      newPostCount: 0,
      posts: [],
      loadingBefore: true,
    });
    setTimeout(() => {
      this.getPost();
    }, 1000);

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
    params.place_id = this.currentPlaceId;
    // call get Favorite posts which sort by recent activity
    this.postApi.getPlacePostsAllSortedByActivity(params)
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
            return b.last_update - a.last_update;
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
      });
  }

  private refresh = () => {
    this.getPost(true);
  }

  /**
   * @function gotoPlacePostsAllSortedByRecentPost
   * @desc Go to Place post route which are sorted by recent posts by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsAllSortedByRecentPost = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/messages`);
  }
  /**
   * @function gotoPlacePostsAllSortedByActivity
   * @desc Go to Place post route which are sorted by recent activity by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsAllSortedByActivity = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/messages/latest-activity`);
  }
  /**
   * @function gotoPlacePostsUnreadSortedByRecent
   * @desc Go to unread posts route which are sorted by recent post by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsUnreadSortedByRecent = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/unread`);
  }
  /**
   * @function gotoPost
   * @desc Go to post route by its `currentPlaceId`
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
   * @memberof addCommentToPostActivity
   * @generator
   */
  public render() {
    /**
     * @name leftItem
     * @desc setting of left Item
     * @const
     * @type {object}
     */
    const leftItem = {
      name: <PlaceName place_id={this.currentPlaceId}/>,
      type: 'title',
      menu: [
        // {
        //   onClick: this.gotoUnreadPosts.bind(this, ''),
        //   name: 'Posts',
        //   isChecked: true,
        //   icon: {
        //     name: 'message16',
        //     size: 16,
        //   },
        // },
        // {
        //   onClick: this.sampleF,
        //   name: 'Files',
        //   isChecked: false,
        //   icon: {
        //     name: 'file16',
        //     size: 16,
        //   },
        // },
        // {
        //   onClick: this.sampleF,
        //   name: 'Activity',
        //   isChecked: false,
        //   icon: {
        //     name: 'log16',
        //     size: 16,
        //   },
        // },
        // {
        //   onClick: this.sampleF,
        //   name: 'Members',
        //   isChecked: false,
        //   icon: {
        //     name: 'placeMember16',
        //     size: 16,
        //   },
        // },
      ],
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
            name: 'Sort',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.gotoPlacePostsAllSortedByRecentPost,
            name: 'Recent Posts',
            isChecked: false,
          },
          {
            onClick: this.gotoPlacePostsAllSortedByActivity,
            name: 'Latest Activity',
            isChecked: true,
          },
          {
            name: 'Filter',
            type: 'kind',
            isChecked: false,
          },
          {
            name: 'All',
            isChecked: true,
          },
          {
            onClick: this.gotoPlacePostsUnreadSortedByRecent,
            name: 'Unseens',
            isChecked: false,
          },
        ],
      },
      // {
      //   name: 'filter24',
      //   type: 'iconII',
      //   menu: [
      //     {
      //       onClick: this.gotoUnreadPosts,
      //       name: 'Place Settings',
      //       isChecked: false,
      //       icon: {
      //         name: 'message16',
      //         size: 16,
      //       },
      //     },
      //     {
      //       onClick: this.gotoUnreadPosts,
      //       name: 'Invite Members',
      //       isChecked: false,
      //       icon: {
      //         name: 'message16',
      //         size: 16,
      //       },
      //     },
      //     {
      //       onClick: this.gotoUnreadPosts,
      //       name: 'Create a Private Place',
      //       isChecked: false,
      //       icon: {
      //         name: 'message16',
      //         size: 16,
      //       },
      //     },
      //     {
      //       onClick: this.gotoUnreadPosts,
      //       name: 'Create a Common Place',
      //       isChecked: false,
      //       icon: {
      //         name: 'message16',
      //         size: 16,
      //       },
      //     },
      //   ],
      // },
    ];

    const loadMore = this.getPost.bind(this);

    return (
      <div className={style.container}>
        {/* rendering NewBadge component in receiving new post case */}
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <NewBadge onClick={this.showNewPosts.bind(this, '')}
                  text="New Post"
                  count={this.state.newPostCount}
                  visibility={this.state.newPostCount > 0}/>
        <div className={privateStyle.postsArea} ref={this.refHandler}>
        {this.state.posts.length > 0 && (
            <InfiniteScroll
              pullDownToRefresh={true}
              pullDownToRefreshContent={(
                <h3 className={privateStyle.pull}><IcoN size={16} name={'arrow16'}/>Pull down to refresh</h3>
              )}
              releaseToRefreshContent={(
                <h3 className={privateStyle.release}><IcoN size={16} name={'arrow16'}/>Release to refresh</h3>
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlacePostsAllSortedByActivity);

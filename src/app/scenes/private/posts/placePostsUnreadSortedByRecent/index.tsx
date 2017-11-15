/**
 * @file scenes/private/posts/placePostsUnreadSortedByRecent/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering unseen posts of a place.
 * Documented by:          Soroush Torkzadeh <sorousht@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            --
 * Date of review:         --
 */
import * as React from 'react';
import {OptionsMenu, PlaceName} from '../../../../components';
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
import {Loading} from '../../../../components/Loading/index';
import SyncActivity from '../../../../services/syncActivity/index';
import SyncActions from '../../../../services/syncActivity/syncActions';
import IActivity from '../../../../api/activity/interfaces/IActivitiy';
import {NewBadge} from 'components/NewBadge';

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
 * @class PlacePostsUnreadSortedByRecent
 * @classdesc Component renders the Place unread posts by recent post
 * @extends {React.Component<IProps, IState>}
 */
class PlacePostsUnreadSortedByRecent extends React.Component<IProps, IState> {
  private postApi: PostApi;
  private currentPlaceId: string | null;
  private syncActivity = SyncActivity.getInstance();
  private syncActivityListeners = [];
  private newPostsIds = [];

  /**
   * Creates an instance of PlacePostsUnreadSortedByRecent.
   * @param {*} props
   * @memberof PlacePostsUnreadSortedByRecent
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
   * @desc updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof PlacePostsUnreadSortedByRecent
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
   * @memberof PlacePostsUnreadSortedByRecent
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
   * @memberof PlacePostsUnreadSortedByRecent
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
    params.place_id = this.currentPlaceId;
    this.postApi.getPlacePostsUnreadSortedByRecent(params)
      .then((response: IPostsListResponse) => {

        if (this.state.posts.length > 0 && response.posts.length < params.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }

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
   * @function gotoPlacePostsUnreadSortedByRecentPost
   * @desc Go to Place post route which are sorted by recent posts by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsUnreadSortedByRecentPost = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/messages`);
  }
  /**
   * @func gotoPost
   * @desc Go to the post page and set the last post in store
   * @private
   * @param {IPost} post
   * @memberof PlacePostsUnreadSortedByRecent
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

    const rightMenu = [
      {
        name: 'sort24',
        type: 'iconI',
        menu: [
          {
            name: 'Filter',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.gotoPlacePostsUnreadSortedByRecentPost,
            name: 'All',
            isChecked: false,
          },
          {
            name: 'Unseens',
            isChecked: true,
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
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <NewBadge onClick={this.showNewPosts.bind(this, '')}
                  text="New Post"
                  count={this.state.newPostCount}
                  visibility={this.state.newPostCount > 0}/>
        <div className={privateStyle.postsArea} ref={this.refHandler}>
          <Loading active={this.state.loadingAfter}/>
          {this.state.posts.map((post: IPost) => (
            <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
              <Post post={post}/>
            </div>))}
          <Loading active={this.state.loadingBefore}/>
          {!this.state.reachedTheEnd && !this.state.loadingAfter &&
          !this.state.loadingBefore && this.state.posts.length === 0 &&
          <div className={privateStyle.emptyMessage}>You don't have any unseen posts.</div>
          }
          {this.state.reachedTheEnd &&
          <div className={privateStyle.emptyMessage}>No more messages here!</div>
          }
          {!this.state.reachedTheEnd && this.state.posts.length > 0 &&
          !this.state.loadingBefore && !this.state.loadingAfter &&
          (
            <div className={privateStyle.loadMore}>
              <Button onClick={loadMore}>Load More</Button>
            </div>
          )
          }
          <div className={privateStyle.bottomSpace}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlacePostsUnreadSortedByRecent);

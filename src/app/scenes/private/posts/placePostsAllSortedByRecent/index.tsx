import * as React from 'react';
import {OptionsMenu, PlaceName} from '../../../../components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../../api/post/index';
import IPost from '../../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../../api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts, setPostsRoute} from '../../../../redux/app/actions/index';
import ArrayUntiles from '../../../../services/untils/array';
import {Button} from 'antd';
import Post from '../components/post/index';
import {browserHistory} from 'react-router';
import {Loading} from '../../../../components/Loading/index';
import {NewBadge} from '../../../../components/NewBadge/index';
import SyncActions from '../../../../services/syncActivity/syncActions';
import IActivity from '../../../../api/activity/interfaces/IActivitiy';
import SyncActivity from '../../../../services/syncActivity/index';

const privateStyle = require('../../private.css');

const style = require('../posts.css');

interface IProps {
  postsRoute: string;
  routing: any;
  posts: IPost[];
  currentPost: IPost | null;
  setPosts: (posts: IPost[]) => {};
  setPostsRoute: (route: string) => {};
  setCurrentPost: (post: IPost) => {};
  params?: any;
  location: any;
}

interface IState {
  posts: IPost[];
  loadingAfter: boolean;
  loadingBefore: boolean;
  reachedTheEnd: boolean;
  newPostCount: number;
}

class PlacePostsAllSortedByRecent extends React.Component<IProps, IState> {
  private postApi: PostApi;
  private currentPlaceId: string | null;
  private syncActivity = SyncActivity.getInstance();
  private syncActivityListeners = [];
  private newPostsIds = [];

  constructor(props: IProps) {
    super(props);
    this.currentPlaceId = this.props.params.placeId;
    this.state = {
      posts: this.props.location.pathname === this.props.postsRoute ? this.props.posts : [],
      loadingAfter: false,
      loadingBefore: false,
      reachedTheEnd: false,
      newPostCount: 0,
    };
  }

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

  public componentDidMount() {
    if (this.props.params.placeId) {
      this.currentPlaceId = this.props.params.placeId;
    }
    this.postApi = new PostApi();
    this.getPost(true);

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

  private addNewPostActivity(activity: IActivity) {
    if (this.newPostsIds.filter((postId) => (postId === activity.post_id)).length === 0) {
      this.newPostsIds.push(activity.post_id);
      this.setState({
        newPostCount: this.newPostsIds.length,
      });
    }
  }

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
    this.postApi.getPlacePostsAllSortedByRecent(params)
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

  private getOffset(id: string) {
    const el = document.getElementById(id).getBoundingClientRect();
    return {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
    };
  }

  private gotoPlacePostsAllSortedByRecentPost = () => {
    browserHistory.push(`/m/places/${this.currentPlaceId}/messages`);
  }

  private gotoPlacePostsAllSortedByActivity = () => {
    browserHistory.push(`/m/places/${this.currentPlaceId}/messages/latest-activity`);
  }

  private gotoPlacePostsUnreadSortedByRecentPost = () => {
    browserHistory.push(`/m/places/${this.currentPlaceId}/unread`);
  }

  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    browserHistory.push(`/m/message/${post._id}`);
  }

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
            name: 'Sort',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.gotoPlacePostsAllSortedByRecentPost,
            name: 'Recent Posts',
            isChecked: true,
          },
          {
            onClick: this.gotoPlacePostsAllSortedByActivity,
            name: 'Latest Activity',
            isChecked: false,
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
            onClick: this.gotoPlacePostsUnreadSortedByRecentPost,
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
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <NewBadge onClick={this.showNewPosts.bind(this, '')}
                  text="New Post"
                  count={this.state.newPostCount}
                  visibility={this.state.newPostCount > 0}/>
        <Loading active={this.state.loadingAfter}/>
        {this.state.posts.map((post: IPost) => (
          <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
            <Post post={post}/>
          </div>))}
        <Loading active={this.state.loadingBefore}/>
        {!this.state.reachedTheEnd && !this.state.loadingAfter &&
        !this.state.loadingBefore && this.state.posts.length === 0 &&
        <div>You don't have any post.</div>
        }
        {this.state.reachedTheEnd &&
        <div>No more messages here!</div>
        }
        {!this.state.reachedTheEnd && this.state.posts.length > 0 &&
        !this.state.loadingBefore && !this.state.loadingAfter &&
        (
          <div className={privateStyle.loadMore}>
            <Button onClick={loadMore}>Load More</Button>
          </div>
        )
        }
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  postsRoute: store.app.postsRoute,
  posts: store.app.posts,
  currentPost: store.app.currentPost,
});

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

export default connect(mapStateToProps, mapDispatchToProps)(PlacePostsAllSortedByRecent);

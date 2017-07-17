import * as React from 'react';
import {OptionsMenu, PlaceName} from '../../../../components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../../api/post/index';
import IPost from '../../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../../api/post/interfaces/IPostsListResponse';
import {setCurrentPost, setPosts} from '../../../../redux/app/actions/index';
import ArrayUntiles from '../../../../services/untils/array';
import {Button} from 'antd';
import Post from '../components/post/index';
import {browserHistory} from 'react-router';

const style = require('../posts.css');

interface IProps {
  routing: any;
  posts: IPost[];
  currentPost: IPost | null;
  setPosts: (posts: IPost[]) => {};
  setCurrentPost: (post: IPost) => {};
  params?: any;
  location: any;
}

interface IState {
  posts: IPost[];
  loadingAfter: boolean;
  loadingBefore: boolean;
  reachedTheEnd: boolean;
}

class PlacePostsAllSortedByActivity extends React.Component<IProps, IState> {
  private postApi: PostApi;
  private currentPlaceId: string | null;

  constructor(props: IProps) {
    super(props);
    this.currentPlaceId = this.props.params.placeId;
    this.state = {
      // posts: this.props.posts,
      posts: [],
      loadingAfter: false,
      loadingBefore: false,
      reachedTheEnd: false,
    }
    ;
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
    this.postApi.getPlacePostsAllSortedByActivity(params)
      .then((response: IPostsListResponse) => {

        if (this.state.posts.length > 0 && response.posts.length < params.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }

        const posts = ArrayUntiles.uniqueObjects(response.posts.concat(this.state.posts), '_id')
          .sort((a: IPost, b: IPost) => {
            return b.last_update - a.last_update;
          });

        if (fromNow === true) {
          this.props.setPosts(posts);
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
    browserHistory.push(`/places/${this.currentPlaceId}/messages`);
  }

  private gotoPlacePostsAllSortedByActivity = () => {
    browserHistory.push(`/places/${this.currentPlaceId}/messages/latest-activity`);
  }

  private gotoPlacePostsUnreadSortedByRecent = () => {
    browserHistory.push(`/places/${this.currentPlaceId}/unread`);
  }

  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    browserHistory.push(`/message/${post._id}`);
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
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <Button onClick={loadMore}>Load More ...</Button>
        {this.state.loadingAfter &&
        <div>Loading new posts...</div>
        }
        {this.state.posts.map((post: IPost) => (
          <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
            <Post post={post}/>
          </div>))}
        {this.state.loadingBefore &&
        <div>Loading...</div>
        }
        {!this.state.reachedTheEnd && !this.state.loadingAfter &&
        !this.state.loadingBefore && this.state.posts.length === 0 &&
        <div>You don't have any messages.</div>
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

const mapStateToProps = (store) => ({
  routing: store.routing,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacePostsAllSortedByActivity);

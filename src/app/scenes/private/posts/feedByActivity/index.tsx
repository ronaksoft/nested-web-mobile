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
}

class FeedByActivity extends React.Component<IProps, IState> {
  private postApi: PostApi;

  constructor(props: IProps) {
    super(props);
    this.state = {
      posts: this.props.location.pathname === this.props.postsRoute ? this.props.posts : [],
      loadingAfter: false,
      loadingBefore: false,
      reachedTheEnd: false,
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({posts: newProps.posts});
  }

  public componentDidMount() {
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
    this.postApi.getFavoritePostsSortedByActivity(params)
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

  private getOffset(id: string) {
    const el = document.getElementById(id).getBoundingClientRect();
    return {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
    };
  }

  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    browserHistory.push(`/message/${post._id}`);
  }

  private gotoFeed() {
    browserHistory.push('/feed');
  }

  public render() {
    const loadMore = this.getPost.bind(this);

    const leftItem = {
      name: 'Feed',
      type: 'title',
      menu: [],
    };

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
            onClick: this.gotoFeed,
            name: 'Recent Posts',
            isChecked: false,
          },
          {
            onClick: null,
            name: 'Latest Activity',
            isChecked: true,
          },
        ],
      },
    ];

    return (
      <div className={style.container}>
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
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
        {
          !this.state.reachedTheEnd &&
          !this.state.loadingAfter &&
          !this.state.loadingBefore &&
          this.state.posts.length === 0 &&
          (
            <div>
              You have no message in your feed
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedByActivity);

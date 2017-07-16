import * as React from 'react';
import {OptionsMenu} from 'components';
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
}

class Shared extends React.Component<IProps, IState> {
  private postApi: PostApi;

  constructor(props: IProps) {
    super(props);
    this.state = {
      posts: this.props.posts,
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
    } else if (typeof after === 'number') {
      params = {
        after,
      };
    } else {
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
    this.postApi.getSentPosts(params)
      .then((response: IPostsListResponse) => {
        const posts = ArrayUntiles.uniqueObjects(response.posts.concat(this.state.posts), '_id')
          .sort((a: IPost, b: IPost) => {
            return b.timestamp - a.timestamp;
          });

        if (fromNow === true) {
          this.props.setPosts(posts);
        }

        this.setState({
          posts,
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

  private gotoPost(post: IPost) {
    this.props.setCurrentPost(post);
    browserHistory.push(`/message/${post._id}`);
  }

  public render() {
    const loadMore = this.getPost.bind(this);

    const leftItem = {
      name: 'Shared',
      type: 'title',
      menu: [],
    };

    const rightMenu = [];

    return (
      <div className={style.container}>
        <OptionsMenu leftItem={leftItem} rightItems={rightMenu}/>
        <Button onClick={loadMore}>Load More ...</Button>
        {this.state.posts.map((post: IPost) => (
          <div key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
            <Post post={post}/>
          </div>))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Shared);

import * as React from 'react';
import {OptionsMenu} from 'components';
import {connect} from 'react-redux';
import IPostsListRequest from '../../../api/post/interfaces/IPostsListRequest';
import PostApi from '../../../api/post/index';
import IPost from '../../../api/post/interfaces/IPost';
import IPostsListResponse from '../../../api/post/interfaces/IPostsListResponse';
import {setPosts} from '../../../redux/app/actions/index';
import ArrayUntiles from '../../../services/untils/array';
import {Button} from 'antd';

interface IProps {
  posts: IPost[];
  setPosts: (posts: IPost[]) => {};
}

interface IState {
  posts: IPost[];
}

class Posts extends React.Component<IProps, IState> {
  private postApi: PostApi;

  constructor(props: IProps) {
    super(props);

    this.state = {
      posts: this.props.posts,
    };
  }

  private getPost(fromNow?: boolean, after?: number) {

    let params: IPostsListRequest;
    if (fromNow === true) {
      params = {
        before: Date.now(),
      };
    } else if (after) {
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
    params.limit = 8;

    this.postApi.getFavoritePosts(params)
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

  public componentDidMount() {
    this.postApi = new PostApi();
    this.getPost(true);
  }
 public sampleF = () => {
    console.log('nothing');
  }

  public render() {
    const leftItem = {
      name: 'feed',
      type: 'title',
      menu: [
        {
          onClick: this.sampleF,
          name: 'Posts',
          isChecked: true,
          icon: {
            name: 'message16',
            size: 16,
          },
        },
        {
          onClick: this.sampleF,
          name: 'Files',
          isChecked: false,
          icon: {
            name: 'file16',
            size: 16,
          },
        },
        {
          onClick: this.sampleF,
          name: 'Activity',
          isChecked: false,
          icon: {
            name: 'log16',
            size: 16,
          },
        },
        {
          onClick: this.sampleF,
          name: 'Members',
          isChecked: false,
          icon: {
            name: 'placeMember16',
            size: 16,
          },
        },
      ],
    };
    const RightItem = [
      {
        name: 'sort24',
        type: 'iconI',
        menu: [
          {
            onClick: this.sampleF,
            name: 'Sort',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.sampleF,
            name: 'Latest Activity',
            isChecked: true,
          },
          {
            onClick: this.sampleF,
            name: 'Recent Posts',
            isChecked: false,
          },
          {
            onClick: this.sampleF,
            name: 'Filter',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.sampleF,
            name: 'All',
            isChecked: true,
          },
          {
            onClick: this.sampleF,
            name: 'Unseens',
            isChecked: false,
          },
        ],
      },
      {
        name: 'filter24',
        type: 'iconII',
        menu: [
          {
            onClick: this.sampleF,
            name: 'Place Settings',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
          {
            onClick: this.sampleF,
            name: 'Invite Members',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
          {
            onClick: this.sampleF,
            name: 'Create a Private Place',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
          {
            onClick: this.sampleF,
            name: 'Create a Common Place',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
        ],
      },
    ];
    return (
      <div>
        <OptionsMenu leftItem={leftItem} rightItems={RightItem}/>
        <Button onClick={this.getPost.bind(this, '')}>Load More ...</Button>
        <b>{this.state.posts[0] && this.state.posts[this.state.posts.length - 1].timestamp}
          => {this.state.posts.length}</b>
        {this.state.posts.map((post: IPost) => (<div key={post._id}>{post.timestamp} -> {post.subject}</div>))};
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  posts: store.app.posts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setPosts: (posts: IPost[]) => {
      dispatch(setPosts(posts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);

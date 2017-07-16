import * as React from 'react';
import IPost from '../../api/post/interfaces/IPost';
import {postAdd} from '../../redux/posts/actions/index';
import PostApi from '../../api/post/index';
import {connect} from 'react-redux';

interface IOwnProps {
  post_id: string;
}

interface IProps {
  post_id: string;
  posts: IPost[];
  postAdd: (post: IPost) => {};
}

interface IState {
  post: IPost | null;
}

class PostSubject extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      post: null,
    };
  }

  public postDidMount() {
    const posts = this.props.posts.filter((post: IPost) => {
      return post._id === this.props.post_id;
    });

    if (posts.length > 0) {
      this.setState({
        post: posts[0],
      });
    } else {
      const postApi = new PostApi();
      postApi.get({post_id: this.props.post_id})
        .then((post: IPost) => {
          this.setState({
            post,
          });
          this.props.postAdd(post);
        });
    }
  }

  public render() {

    const {post} = this.state;
    if (!post) {
      return null;
    }
    return (
      <span>{post.subject}</span>
    );
  }
}

const mapStateToProps = (store, ownProps: IOwnProps) => ({
  posts: store.posts.posts,
  post_id: ownProps.post_id,
});

const mapDispatchAction = (dispatch) => {
  return {
    postAdd: (post: IPost) => {
      dispatch(postAdd(post));
    },
  };
};

export default connect(mapStateToProps, mapDispatchAction)(PostSubject);

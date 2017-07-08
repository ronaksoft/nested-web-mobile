import IPost from './IPost';

interface IPostsListResponse {
  skip?: number | null;
  limit?: number;
  posts: IPost[];
}

export default IPostsListResponse;

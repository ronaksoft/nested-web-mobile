import IPost from './IPost';

interface IManyPostResponse {
  posts: IPost;
  no_access: string[];
}

export default IManyPostResponse;

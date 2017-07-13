import IPost from '../../api/post/interfaces/IPost';

export interface IPostStore {
  posts: IPost[];
}

export interface IPostAction {
  type: string;
  payload?: IPost;
}

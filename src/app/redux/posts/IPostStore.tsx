import IPost from '../../api/post/interfaces/IPost';

export interface IPostStore {}

export interface IPostAction {
  type: string;
  payload?: IPost| IPost[];
}

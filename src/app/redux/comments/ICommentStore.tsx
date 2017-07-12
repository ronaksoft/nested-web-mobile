import IComment from '../../api/comment/interfaces/IComment';

export interface ICommentStore {
  comments: IComment[];
}

export interface ICommentAction {
  type: string;
  payload?: IComment;
}

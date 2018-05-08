import {IComment} from 'api/interfaces';

export interface ICommentStore {
  comments: IComment[];
}

export interface ICommentAction {
  type: string;
  payload?: IComment;
}

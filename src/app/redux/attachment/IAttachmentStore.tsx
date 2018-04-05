import IPostAttachment from '../../api/post/interfaces/IPostAttachment';

export interface IAttachmentStore {
  attachments: IPostAttachment[];
  currentAttachmentList: IPostAttachment[];
  currentAttachment: IPostAttachment,
  currentPost: string,
  currentPlace: string,
}

export interface IAttachmentAction {
  type: string;
  payload?: IPostAttachment | IPostAttachment[] | any;
}

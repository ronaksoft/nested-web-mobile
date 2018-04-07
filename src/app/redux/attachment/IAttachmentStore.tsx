import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import IFile from '../../components/FileItem/IFile';

export interface IAttachmentStore {
  attachments: IPostAttachment[];
  currentAttachmentList: IPostAttachment[];
  currentAttachment: IPostAttachment,
  currentPost: string,
  currentPlace: string,
}

export interface IAttachmentAction {
  type: string;
  payload?: IPostAttachment | IPostAttachment[] | IFile | IFile[] | any;
}

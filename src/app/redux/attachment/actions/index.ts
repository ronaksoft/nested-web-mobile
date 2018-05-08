import {IAttachmentAction} from '../IAttachmentStore';
import * as ActionTypes from './types';
import IPostAttachment from '../../../api/post/interfaces/IPostAttachment';
import IFile from '../../../components/FileItem/IFile';

export function setCurrentAttachment(attachment: IPostAttachment | IFile): IAttachmentAction {
  return {
    type: ActionTypes.SET_CURRENT_ATTACHMENT,
    payload: attachment,
  };
}
export function unsetCurrentAttachment(): IAttachmentAction {
  return {
    type: ActionTypes.UNSET_CURRENT_ATTACHMENT,
    payload: {},
  };
}
export function setCurrentAttachmentList(attachments: IPostAttachment[] | IFile[]): IAttachmentAction {
  return {
    type: ActionTypes.SET_CURRENT_ATTACHMENT_LIST,
    payload: attachments,
  };
}
export function setCurrentPlace(placeId: string): IAttachmentAction {
  return {
    type: ActionTypes.SET_CURRENT_PLACE,
    payload: placeId,
  };
}
export function setCurrentPost(postId: string): IAttachmentAction {
  return {
    type: ActionTypes.SET_CURRENT_POST,
    payload: postId,
  };
}

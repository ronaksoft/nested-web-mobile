import {IAttachmentAction} from '../IAttachmentStore';
import * as ActionTypes from './types';
import IPostAttachment from '../../../api/post/interfaces/IPostAttachment';

export function taskAdd(attachment: IPostAttachment): IAttachmentAction {
  return {
    type: ActionTypes.ATTACHMENT_ADD,
    payload: attachment,
  };
}
export function taskUpdate(attachment: IPostAttachment): IAttachmentAction {
  return {
    type: ActionTypes.ATTACHMENT_UPDATE,
    payload: attachment,
  };
}
export function setCurrentAttachment(attachment: IPostAttachment): IAttachmentAction {
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
export function setCurrentAttachmentList(attachments: IPostAttachment[]): IAttachmentAction {
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

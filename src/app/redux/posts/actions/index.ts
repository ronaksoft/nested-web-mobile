import IPost from 'api/post/interfaces/IPost';
import {IPostAction} from '../IPostStore';
import * as ActionTypes from './types';

export function postAdd(post: IPost): IPostAction {
  return {
    type: ActionTypes.POST_ADD,
    payload: post,
  };
}

export function postUpdate(post: IPost): IPostAction {
  return {
    type: ActionTypes.POST_UPDATE,
    payload: post,
  };
}

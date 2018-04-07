import {IAttachmentAction} from '../IAttachmentStore';
import * as Immutable from 'seamless-immutable';
import * as ActionTypes from '../actions/types';
import IPostAttachment from '../../../api/post/interfaces/IPostAttachment';

/** Initial Places State */
const initialState = Immutable.from<IAttachmentStore>({
  attachments: [],
  currentAttachmentList: [],
  currentAttachment: {},
  currentPost: '',
  currentPlace: '',
});

export default function attachmentReducer(state = initialState, action?: IAttachmentAction) {

  switch (action.type) {
    case ActionTypes.ATTACHMENT_ADD:
      // check state for finding place
      if (action.payload === undefined) {
        return state;
      }
      const attachments = Immutable.getIn(state, ['attachments']);
      const indexOfAttachment: number = attachments.findIndex((a: IPostAttachment) => {
        return a._id === action.payload._id;
      });

      if (indexOfAttachment === -1) {
        const newState = [action.payload].concat(Immutable(state.attachments));
        return Immutable({attachments: newState});
      } else {
        return state;
      }

    case ActionTypes.ATTACHMENT_UPDATE:
      let currentAttachmentList;
      currentAttachmentList = Immutable.asMutable(state, ['attachments']);
      currentAttachmentList.attachments[indexOfAttachment] = action.payload;
      return currentAttachmentList;

    case ActionTypes.SET_CURRENT_ATTACHMENT:
      return Immutable.merge(state, {
        currentAttachment: action.payload,
      });

    case ActionTypes.SET_CURRENT_ATTACHMENT_LIST:
      return Immutable.merge(state, {
        currentAttachmentList: action.payload,
      });

    case ActionTypes.SET_CURRENT_PLACE:
      return Immutable.merge(state, {
        currentPlace: action.payload,
      });

    case ActionTypes.SET_CURRENT_POST:
      return Immutable.merge(state, {
        currentPost: action.payload,
      });

    case ActionTypes.UNSET_CURRENT_ATTACHMENT:
      return Immutable.merge(state, {
        currentAttachment: {},
        currentAttachmentList: [],
        currentPost: '',
        currentPlace: '',
      });

    default :
      return state;

  }
}

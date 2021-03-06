import {IAttachment} from 'api/interfaces';
import {IChipsItem} from 'components/Chips';

interface IComposeState {
  subject?: string;
  body?: string;
  contentType: string;
  attachments: IAttachment[];
  targets: IChipsItem[];
  allowComment: boolean;
  addSignature: boolean;
  userSignature: any;
  sending: boolean;
  attachModal?: boolean;
  unselectSelectedRecipient?: number;
  composeOption: boolean;
  editPost: boolean;
}

export default IComposeState;
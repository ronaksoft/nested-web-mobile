import {IAttachment} from 'api/attachment/interfaces';
import {IChipsItem} from 'components/Chips';

interface IComposeState {
  subject?: string;
  body?: string;
  attachments: IAttachment[];
  targets: IChipsItem[];
  allowComment: boolean;
  loading: boolean;
  attachModal?: boolean;
  unselectSelectedRecipient?: number;
   composeOption: boolean;
}

export default IComposeState;
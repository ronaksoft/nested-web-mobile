import {IAttachment} from 'api/attachment/interfaces';

interface IComposeState {
  subject?: string;
  body?: string;
  attachments: IAttachment[];
  targets: string[];
  allowComment: boolean;
  loading: boolean;
  attachModal?: boolean;
  unselectSelectedRecipient?: number;
}

export default IComposeState;
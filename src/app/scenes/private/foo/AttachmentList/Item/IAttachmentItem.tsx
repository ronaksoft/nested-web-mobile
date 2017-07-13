import {IAttachment} from 'api/attachment/interfaces';
import Mode from './mode';

interface IProgress {
  total: number;
  loaded: number;
}

interface IAttachmentItem {
  id: number;
  model: IAttachment;
  progress: IProgress;
  mode: Mode;
  name: string;
  type: string;
  size: number;
  uploading?: boolean;
  finished?: boolean;
  failed?: boolean;
  aborted?: boolean;
}

export default IAttachmentItem;
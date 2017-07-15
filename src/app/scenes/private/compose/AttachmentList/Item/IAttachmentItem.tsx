import {IAttachment} from 'api/attachment/interfaces';
import Mode from './mode';
import IProgress from '../IProgress';

/**
 * the interface is used to generate Items of AttachmentList
 *
 * @interface IAttachmentItem
 */
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

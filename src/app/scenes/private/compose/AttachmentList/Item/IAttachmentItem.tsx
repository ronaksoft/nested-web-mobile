/**
 * @file scenes/private/compose/AttachmentList/Item/IAttachmentItem.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description An interface for creating every `Item` of `AttachmentList`
 * in both `VIEW` and `UPLOAD` mode
 * @export IAttachmentItem
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-25
 * Reviewed by:            -
 * Date of review:         -
 */

import {IAttachment} from 'api/attachment/interfaces';
import Mode from './mode';
import IProgress from '../IProgress';

/**
 * the interface is used to generate Items of AttachmentList
 *
 * @interface IAttachmentItem
 * @description
 */
interface IAttachmentItem {
  /**
   * @prop id
   * @desc A unique id that we use to distinguish attachments in UPLOAD mode
   * @type {number}
   * @memberof IAttachmentItem
   */
  id: number;
  /**
   * @prop model
   * @desc An attachment model that we use to create an Item in VIEW mode
   * @type {IAttachment}
   * @memberof IAttachmentItem
   */
  model: IAttachment;
  /**
   * @prop progress
   * @desc Indicates uploading progress of a file
   * @type {IProgress}
   * @memberof IAttachmentItem
   */
  progress?: IProgress;
  /**
   * @prop mode
   * @desc Attachment mode (UPLOAD or VIEW)
   * @type {Mode}
   * @memberof IAttachmentItem
   */
  mode: Mode;
  /**
   * @prop name
   * @desc The selected File name
   * @type {string}
   * @memberof IAttachmentItem
   */
  name?: string;
  /**
   * @prop type
   * @desc File type e.g., text/plain
   * @type {string}
   * @memberof IAttachmentItem
   */
  type?: string;
  /**
   * @prop size
   * @desc The selected File size in bytes
   * @type {number}
   * @memberof IAttachmentItem
   */
  size?: number;
  /**
   * @prop uploading
   * @desc A flag that shows a file is uploading
   * @type {boolean}
   * @memberof IAttachmentItem
   */
  uploading?: boolean;
  /**
   * @prop finished
   * @desc A flag that indicates the file has been uploaded successfully
   * @type {boolean}
   * @memberof IAttachmentItem
   */
  finished?: boolean;
  /**
   * @prop failed
   * @desc A flag that indicates the file has been uploaded successfully
   * @type {boolean}
   * @memberof IAttachmentItem
   */
  failed?: boolean;
  /**
   * @prop aborted
   * @desc A flag that indicates file upload whether is aborted or not
   * @type {boolean}
   * @memberof IAttachmentItem
   */
  aborted?: boolean;
}

export default IAttachmentItem;

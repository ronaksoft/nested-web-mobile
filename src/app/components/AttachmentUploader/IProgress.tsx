/**
 * @file scenes/private/compose/AttachmentList/IProgress.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description An interface for attachment upload progress
 * @export AttachmentItem
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-25
 * Reviewed by:            -
 * Date of review:         -
 */

/**
 * @interface IProgress
 * @desc Indicates the progress of a file while is uploading.
 */
interface IProgress {
  /**
   * @prop total
   * @desc The file size in bytes
   * @type {number}
   * @memberof IProgress
   */
  total: number;
  /**
   * @prop loaded
   * @desc The part of file that has been uploaded in bytes
   * @type {number}
   * @memberof IProgress
   */
  loaded: number;
}

export default IProgress;
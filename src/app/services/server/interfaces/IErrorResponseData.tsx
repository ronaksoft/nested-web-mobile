/**
 * @file services/server/interfaces/IErrorResponseData.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Interface of error response data
 * @exports IErrorResponseData
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-26
 * Reviewed by:            -
 * Date of review:         -
 */
import Failure from '../failure';

/**
 * @interface IErrorResponseData
 * @desc Error response data
 */
interface IErrorResponseData {
  /**
   * @desc Cyrus error code that represents the reason of failure:
   * @prop err_code
   * @type {Failure}
   * @memberof IErrorResponseData
   */
  err_code: Failure;
  items: string[];
}

export default IErrorResponseData;

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


/**
 * @interface IErrorResponseData
 * @desc Error response data
 */
interface IErrorResponseData {
  // TODO: Use an enum instaed of number.
  /**
   * @desc Cyrus error code that represents the reason of failure:
   * (-1) UNAUTHORIZED
   * (0) UNKNOWN
   * (1) ACCESS_DENIED
   * (2) UNAVAILABLE
   * (3) INVALID
   * (4) INCOMPLETE
   * (5) DUPLICATE
   * (6) LIMIT_REACHED
   * (7) TIMEOUT
   * (8) SESSION_EXPIRE
   * @prop err_code
   * @type {number}
   * @memberof IErrorResponseData
   */
  err_code: number;
  items: string[];
}

export default IErrorResponseData;

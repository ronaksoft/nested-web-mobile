/**
 * @file services/server/interfaces/IRequest.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Cysrus request data interface
 * @exports IRequest
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-26
 * Reviewed by:            -
 * Date of review:         -
 */

/**
 * @interface IRequest
 * @desc Interface of a request
 */
interface IRequest {
  /**
   * @prop _reqid
   * @desc A uniquely generated Id for a request. We use the Id to match the request with a response
   * @type {string}
   * @memberof IRequest
   */
  _reqid?: string;
  /**
   * @prop cmd
   * @desc The request command
   * @type {string}
   * @memberof IRequest
   */
  cmd: string;
  /**
   * @prop data
   * @desc The request payload
   * @type {{}}
   * @memberof IRequest
   */
  data?: {};
  /**
   * @prop withoutQueue
   * @desc If withoutQueue has been set to true, The request will be sent out of line
   * @type {boolean}
   * @memberof IRequest
   */
  withoutQueue?: boolean;
}

export default IRequest;

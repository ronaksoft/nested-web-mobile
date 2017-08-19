/**
 * @file api/system/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description APIs are related to the nested
 *              Documented by:          robzizo
 *              Date of documentation:  2017-08-19
 *              Reviewed by:            -
 *              Date of review:         -
 * @export SystemApi
 */
import Api from 'api';

/**
 * @class SystemApi
 * @desc APIs are related to system constants
 */
export default class SystemApi {

  /**
   * @prop api
   * @desc An instance of base Api
   * @private
   * @memberof SystemApi
   */
  private api;

  /**
   * Creates an instance of SystemApi.
   * @memberof SystemApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func get
   * @desc Gets system constants from server
   * @returns {Promise<any>}
   * @memberof SystemApi
   */
  public get() {
    return this.api.request({
      cmd: 'admin/get_int_constants',
    });
  }

}

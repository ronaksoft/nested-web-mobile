/**
 * @file api/system/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description APIs are related to the nested
 *              Documented by:          robzizo
 *              Date of documentation:  2017-08-19
 *              Reviewed by:            -
 *              Date of review:         -
 * @export AppApi
 */
import Api from 'api';

/**
 * @class AppApi
 * @desc APIs are related to system constants
 */
export default class AppApi {

  /**
   * @prop api
   * @desc An instance of base Api
   * @private
   * @memberof AppApi
   */
  private api;

  /**
   * Creates an instance of AppApi.
   * @memberof AppApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func createToken
   * @desc Creates token for app
   * @returns {Promise<any>}
   * @memberof AppApi
   */
  public createToken(appId: string) {
    return this.api.request({
      cmd: 'app/create_token',
      data: {
        app_id: appId,
      },
    });
  }

}

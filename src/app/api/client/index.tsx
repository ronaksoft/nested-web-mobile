/**
 * @file api/client/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description APIs are related to the client
 *              Documented by:          robzizo
 *              data of documentation:  2017-08-19
 *              Reviewed by:            -
 *              data of review:         -
 * @export ClientApi
 */
import Api from 'api';

/**
 * @class ClientApi
 * @desc APIs are related to system constants
 */
export default class ClientApi {

  /**
   * @prop api
   * @desc An instance of base Api
   * @private
   * @memberof ClientApi
   */
  private api;

  /**
   * Creates an instance of ClientApi.
   * @memberof ClientApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  public save(name: string, value: string) {
    return this.api.request({
      cmd: 'client/save_key',
      data: {
        key_name: name,
        key_value: value,
      },
    });
  }

  public read(name: string) {
    return new Promise((resolve, reject) => {
      return this.api.request({
        cmd: 'client/read_key',
        data: {
          key_name: name,
        },
      }).then((res: any) => resolve(res.key_value)).catch((err: any) => reject(err));
    });
  }

  public remove(name: string) {
    return this.api.request({
      cmd: 'client/remove_key',
      data: {
        key_name: name,
      },
    });
  }

}

/**
 * @file api/cache/interfaces/IRequestKeyList.tsx
 * @author Hamidreza KK <hamidrezakks@gmail.com>
 * @desc Request Key List interface
 * @exports IRequestKeyList
 * Documented by: Hamidreza KK
 * Date of documentation:  2017-08-01
 * Reviewed by:            -
 * Date of review:         -
 */

import {IResponse} from 'services/server';

/**
 * @interface IRequestKeyList
 * @desc Interface of a request key list
 */
interface IRequestKeyList {
  /**
   * @prop request
   * @desc Contains requests of APIs
   * @type {array}
   * @memberof IRequestKeyList
   */
  request: any[];

  /**
   * @prop IResponse
   * @desc Response of API
   * @type {IResponse}
   * @memberof IRequestKeyList
   */
  response: IResponse;

  /**
   * @prop status
   * @desc Status of API
   * @type {string}
   * @memberof IRequestKeyList
   */
  status: string;

  /**
   * @prop resolve
   * @desc Resolve flag
   * @type {boolean}
   * @memberof IRequestKeyList
   */
  resolve: boolean;
}

export default IRequestKeyList;

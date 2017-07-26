/**
 * @file services/server/interfaces/IResponse.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc A response from Cyrus
 * @exports IResponse
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-26
 * Reviewed by:            -
 * Date of review:         -
 */

import IErrorResponseData from './IErrorResponseData';
/**
 * @interface IResponse
 * @desc Interface of Cyrus responses
 */
interface IResponse {
    /**
     * @prop A unique Id that matches 
     * @desc
     * @type {(string | number)}
     * @memberof IResponse
     */
    _reqid ?: string | number;
    /**
     * @prop data
     * @desc A requested data or the reason of failure
     * @type {(IErrorResponseData | {})}
     * @memberof IResponse
     */
    data : IErrorResponseData | {};
    // TODO: Define a type
    /**
     * @prop status
     * @desc Response status which can be "ok" or "err"
     * @type {string}
     * @memberof IResponse
     */
    status: string;
}

export default IResponse;

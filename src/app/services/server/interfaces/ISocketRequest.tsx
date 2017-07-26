/**
 * @file services/server/interfaces/ISocketRequest.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Interface of a low level request in Socket layer
 * @exports ISocketRequest
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-26
 * Reviewed by:            -
 * Date of review:         -
 */
import IRequest from './IRequest';

/**
 * @desc Interface of a Socket request.
 * 
 * @interface ISocketRequest
 * @extends {IRequest}
 */
interface ISocketRequest extends IRequest {
    /**
     * @desc The authenticated user session-key
     * @prop _sk
     * @type {(string | null)}
     * @memberof ISocketRequest
     */
    _sk: string | null;
    /**
     * @desc The authenticated user session-secret
     * @prop _ss
     * @type {(string | null)}
     * @memberof ISocketRequest
     */
    _ss: string | null;
    /**
     * @prop _cver
     * @desc The client version
     * @type {number}
     * @memberof ISocketRequest
     */
    _cver: number;
    /**
     * @desc The client Id e.g., android
     * @prop _cid
     * @type {string}
     * @memberof ISocketRequest
     */
    _cid: string;
    /**
     * @desc A uniquely generated Id that we use to match a response with its related request
     * @prop _reqid
     * @type {string}
     * @memberof ISocketRequest
     */
    _reqid: string;
    /**
     * @prop cmd
     * @desc The request command
     * @type {string}
     * @memberof ISocketRequest
     */
    cmd: string;
    /**
     * @prop data
     * @desc The request payload
     * @type {*}
     * @memberof ISocketRequest
     */
    data: any;
    /**
     * @prop withoutQueue
     * @desc If withoutQueue has been set to true, The request will be sent out of line
     * @type {boolean}
     * @memberof IRequest
     */
    withoutQueue: boolean;
}

export default ISocketRequest;

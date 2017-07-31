/**
 * @file api/cache/index.tsx
 * @author Hamidreza KK <hamidrezakks@gmail.com>
 * @desc All APIs are related to Post
 * @export PlaceApi
 * Documented by:         Hamidreza KK
 * Date of documentation: 2017-07-31
 * Reviewed by:           -
 * Date of review:        -
 */
import {IRequest, IResponse} from 'services/server';

/**
 * @class ApiCache
 * @desc Base of all Api Cache classes
 */
class ApiCache {
  private requestKeyList: any[] = [];

  public constructor() {
  }

  /**
   * @func observeRequest
   * @desc Observe Api request for caching them like as a value object
   * @param {IRequest} req, requestFunction
   * @returns {Promise<any>}
   * @memberof ApiCache
   */
  public observeRequest(req: IRequest, requestFunction): Promise<any> {
    const requestKeyJson: any = {
      cmd: req.cmd,
      data: req.data,
    };
    const requestKey: string = JSON.stringify(requestKeyJson);
    if (!this.requestKeyList.hasOwnProperty(requestKey)) {
      this.requestKeyList[requestKey] = {
        request: [],
        response: null,
        status: null,
        resolve: true,
      };
      requestFunction().then((response: IResponse) => {
        if (response.status === 'ok') {
          this.requestKeyList[requestKey].response = response.data;
          this.requestKeyList[requestKey].resolve = true;
        } else {
          this.requestKeyList[requestKey].response = response.data;
          this.requestKeyList[requestKey].resolve = false;
        }
        this.requestKeyList[requestKey].status = response.status;
        this.callAllPromisesByRequestKey(requestKey);
      }).catch(() => {
        // this.requestKeyList[requestKey].response = null;
        // this.requestKeyList[requestKey].resolve = null;
        this.callAllPromisesByRequestKey(requestKey);
      });
    }

    let internalResolve;
    let internalReject;

    const promise = new Promise((res, rej) => {
      internalResolve = res;
      internalReject = rej;
    });

    this.requestKeyList[requestKey].request.push({
      param: req,
      promise: {
        resolve: internalResolve,
        reject: internalReject,
      },
    });

    return promise;
  }

  /**
   * @func callAllPromisesByRequestKey
   * @desc call all promises by key request
   * @param {string} requestKey
   * @returns {void}
   * @memberof ApiCache
   */
  private callAllPromisesByRequestKey(requestKey: string): any {
    const requestList = this.requestKeyList[requestKey];
    requestList.request.forEach((value) => {
      const response: IResponse = {
        _reqid: value.param._reqid,
        status: requestList.status,
        data: requestList.response,
      };
      if (requestList.resolve === true) {
        value.promise.resolve(response.data);
      } else if (requestList.resolve === null) {
        value.promise.reject();
      } else {
        value.promise.reject(response.data);
      }
    });
    delete this.requestKeyList[requestKey];
  }
}

export default ApiCache;

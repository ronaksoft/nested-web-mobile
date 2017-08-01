/**
 * @file api/requestBundle/index.tsx
 * @author Hamidreza KK <hamidrezakks@gmail.com>
 * @desc API value object cache
 * @export ApiCache
 * Documented by:         Hamidreza KK
 * Date of documentation: 2017-08-01
 * Reviewed by:           -
 * Date of review:        -
 */

/**
 * @class RequestBundle
 * @desc Base of all RequestBundle classes
 */
class RequestBundle {
  private static instance;
  private bundleRequestList: any[] = [];

  private constructor() {
    //
  }

  /**
   * @func getInstance
   * @desc Creates an instance of RequestBundle and keeps it singleton while the app is running
   * @static
   * @returns {RequestBundle}
   * @memberof RequestBundle
   */
  public static getInstance(): RequestBundle {
    if (!RequestBundle.instance) {
      RequestBundle.instance = new RequestBundle();
    }
    return RequestBundle.instance;
  }

  /**
   * @func observeRequst
   * @desc Observe requests in order to bundle them
   * @returns {Promise}
   * @memberof RequestBundle
   */
  public observeRequst(domain: string, parameter: string, isMany: boolean = false, paramKey: string, func: any) {
    console.log('observeRequst');
    if (domain !== null) {
      if (!this.bundleRequestList.hasOwnProperty(domain)) {
        this.bundleRequestList[domain] = {
          request: [],
          response: null,
        };
        setTimeout(() => {
          const ids = this.getBundleIds(domain);
          func(ids).then((response) => {
            console.log(this.bundleRequestList[domain].requset.length + ' request(s) bundled');
            this.bundleRequestList[domain].reponse = response;
            this.resolveAllPromisesByDomain(domain, paramKey);
          }).catch(() => {
            this.rejectAllPromisesByDomain(domain);
          });
        }, 100);
      }
      let internalResolve;
      let internalReject;

      const promise = new Promise((res, rej) => {
        internalResolve = res;
        internalReject = rej;
      });

      this.bundleRequestList[domain].request.push({
        param: parameter,
        ids: null,
        many: isMany,
        promise: {
          resolve: internalResolve,
          reject: internalReject,
        },
      });

      return promise;
    } else {
      return null;
    }
  }

  /**
   * @func extractCommaSeparatedIds
   * @desc Create an array from comma separated string
   * @param {string} str
   * @returns {array}
   * @memberof RequestBundle
   */
  private extractCommaSeparatedIds(str: string) {
    return str.split(',');
  }

  /**
   * @func getBundleIds
   * @desc Create a distinct array from ids
   * @param {string} domain
   * @returns {string}
   * @memberof RequestBundle
   */
  private getBundleIds(domain: string) {
    const idList: string[] = [];
    const bundleList = this.bundleRequestList[domain];
    bundleList.request.forEach((value) => {
      const subIds = this.extractCommaSeparatedIds;
      value.ids = subIds;
      subIds(value.request.param).forEach((subValue) => {
        if (idList.indexOf(subValue) === -1) {
          idList.push(subValue);
        }
      });
    });
    return idList.join(',');
  }

  /**
   * @func resolveAllPromisesByDomain
   * @desc Resolve all promises that was registered in bundle
   * @param {string} domain
   * @param {string} paramKey
   * @returns {string}
   * @memberof RequestBundle
   */
  private resolveAllPromisesByDomain(domain: string, paramKey: string) {
    const requestList = this.bundleRequestList[domain];
    const responses = requestList.response;
    requestList.request.forEach((request) => {
      request.ids.forEach((subValue) => {
        responses.forEach((response) => {
          const dataList = [];
          if (subValue === response[paramKey]) {
            dataList.push(response);
          }
          if (request.many) {
            request.promise.resolve(dataList);
          } else {
            request.promise.resolve(dataList[0]);
          }
        });
      });
    });
    delete this.bundleRequestList[domain];
  }

  /**
   * @func rejectAllPromisesByDomain
   * @desc Reject all promises that was registered in bundle
   * @param {string} domain
   * @returns {string}
   * @memberof RequestBundle
   */
  private rejectAllPromisesByDomain(domain: string) {
    const requestList = this.bundleRequestList[domain];
    requestList.request.forEach((request) => {
      request.promise.reject();
    });
    delete this.bundleRequestList[domain];
  }
}

export default RequestBundle;

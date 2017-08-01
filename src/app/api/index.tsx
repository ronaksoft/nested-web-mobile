/**
 * @file api/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc All APIs are related to Post
 * @export PlaceApi
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-29
 * Reviewed by:           -
 * Date of review:        -
 */
import {Server, IRequest, IResponse} from 'services/server';
import Unique from './../services/utils/unique';
import {setNewConfig} from './../config';

/**
 * @class Api
 * @desc Base of all Api classes
 */
class Api {
  private static instance;
  private server;
  private messageCanceller = null;
  private hasCredential: boolean = false;
  private syncActivityListeners: object = {};
  private requestKeyList: any[] = [];

  private constructor() {
    // start api service
    this.syncActivityListeners = {};
  }

  /**
   * @func getInstance
   * @desc Creates an instance of Api and keeps it singletonewhile the app is running
   * @static
   * @returns {Api}
   * @memberof Api
   */
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  /**
   * @func setHasCredential
   * @desc Sets value of hasCredential
   * @param {boolean} value
   * @memberof Api
   */
  public setHasCredential(value: boolean) {
    this.hasCredential = value;
  }

  /**
   * @func getHasCredential
   * @desc Returns value of hasCredential
   * @returns
   * @memberof Api
   */
  public getHasCredential() {
    return this.hasCredential;
  }

  /**
   * @func request
   * @desc Sends a request and resolves/rejects based on the response
   * @param {IRequest} req
   * @returns {Promise<any>}
   * @memberof Api
   */
  public request(req: IRequest): Promise<any> {
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
      this.getServer().request(req).then((response: IResponse) => {
        if (response.status === 'ok') {
          this.requestKeyList[requestKey].response = response.data;
          this.requestKeyList[requestKey].resolve = true;
        } else {
          this.requestKeyList[requestKey].response = response.data;
          this.requestKeyList[requestKey].resolve = false;
        }
        console.log(response.data);
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

    // return new Promise((resolve, reject) => {
    //   this.getServer().request(req).then((response: IResponse) => {
    //     if (response.status === 'ok') {
    //       resolve(response.data);
    //     } else {
    //       reject(response.data);
    //     }
    //   }).catch(reject);
    // });
  }

  /**
   * @func callAllPromisesByRequestKey
   * @desc call all promises by key request
   * @param {string} requestKey
   * @returns {void}
   * @memberof Api
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

  // TODO: Ask sina to explain these functions
  public addSyncActivityListener(callback: (syncObj: any) => void): any {
    const listenerId = 'listener_' + Unique.get();
    console.log(this.syncActivityListeners, listenerId);
    this.syncActivityListeners[listenerId] = callback;
    const canceler = () => {
      delete this.syncActivityListeners[listenerId];
    };
    return canceler;
  }

  private callServerMessageListener(message: any) {
    if (message.cmd === 'sync-a') {
      Object.keys(this.syncActivityListeners).forEach((key: string) => {
        this.syncActivityListeners[key](message.data);
      });
    }
  }

  private getServer() {
    if (!this.server) {
      this.server = new Server();
    }
    if (this.messageCanceller === null) {
      this.messageCanceller = this.server.addMessageListener(this.callServerMessageListener.bind(this));
    }
    return this.server;
  }

  /**
   * Get end point configs from /getConfig
   * get configs from remote server and if response is `ok`, application config will be replace with new configs
   *
   * @param {string} domain Domain name
   * @returns {Promise<any>}
   */
  public reconfigEndPoints(domain: string): Promise<any> {
    const api = this;
    return new Promise((resolve, reject) => {

      // create request path
      const getConfigUrl = `${window.location.protocol}://${window.location.host}/getConfig/${domain}`;

      // create xhr request
      const xhr = new XMLHttpRequest();
      xhr.open('GET', getConfigUrl, true);
      // These request headers are required for talking to Xerxes
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.onload = () => {
        if (xhr.status === 200) {
          let newConfigs: any;

          // try to parse response text
          try {
            newConfigs = JSON.parse(xhr.response);
          } catch (e) {
            reject();
            return;
          }

          if (newConfigs.status === 'ok') {

            // replace configs with new configs
            setNewConfig(
              domain,
              newConfigs.data.cyrus.ws[0],
              newConfigs.data.cyrus.http[0],
              newConfigs.data.xerxes.http[0],
            );

            // close server socket and remove current server
            api.server.socket.close();
            api.server = null;

            // store domain of new configs in local storage
            if (process.env.BROWSER) {
              localStorage.setItem('nested.server.domain', domain);
            }
            resolve();
          } else {
            reject();
          }
        } else {
          reject();
        }
      };

      xhr.send();

    });
  }

}

export default Api;

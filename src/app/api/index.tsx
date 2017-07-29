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
import {Server, IRequest} from 'services/server';
import {IResponse} from 'services/server';
import Unique from './../services/utils/unique';

/**
 * @class Api
 * @desc Base of all Api classes
 */
class Api {
  private hasCredential: boolean = false;
  private static instance;
  private server;
  private syncActivityListeners: object = {};
  private messageCanceller = null;

  private constructor() {
    this.syncActivityListeners = {};
    // start api service
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
    return new Promise((resolve, reject) => {
      this.getServer().request(req).then((response: IResponse) => {
        if (response.status === 'ok') {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      }).catch(reject);
    });
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

}

export default Api;

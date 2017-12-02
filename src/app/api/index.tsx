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
import {forEach, startsWith} from 'lodash';
import {Server, IRequest, IResponse} from 'services/server';
import IRequestKeyList from './cache/interface/IRequestKeyList';
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
  private requestKeyList: IRequestKeyList[] = [];

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
    const requestKeyJson: IRequest = {
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
        this.requestKeyList[requestKey].status = response.status;
        this.callAllPromisesByRequestKey(requestKey);
      }).catch((error) => {
        console.log(error);
        console.log('Promise Catch');
        this.requestKeyList[requestKey].response = null;
        this.requestKeyList[requestKey].resolve = null;
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
      const getConfigUrl = `https://npc.nested.me/dns/discover/${domain}`;
      // const getConfigUrl = `https://webapp.nested.me/getConfig/${domain}`;

      // create xhr request
      const xhr = new XMLHttpRequest();
      xhr.open('GET', getConfigUrl, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response: any = JSON.parse(xhr.response);
          let newConfigs: any;
          // try to parse response text
          try {
            newConfigs = this.parseConfigFromRemote(response.data);
          } catch (e) {
            reject();
            return;
          }

          if (response.status === 'ok') {

            // replace configs with new configs
            setNewConfig(
              domain,
              newConfigs.websocket,
              newConfigs.register,
              newConfigs.store,
            );

            // close server socket and remove current server
            if (api.server) {
              api.server.socket.close();
              api.server = null;
            }

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

  private parseConfigFromRemote(data: any) {
    const cyrus = [];
    const xerxes = [];
    const admin = [];
    forEach(data, (configs) => {
      const config = configs.split(';');
      forEach(config, (item) => {
        if (startsWith(item, 'cyrus:')) {
          cyrus.push(item);
        } else if (startsWith(item, 'xerxes:')) {
          xerxes.push(item);
        }
        if (startsWith(item, 'admin:')) {
          admin.push(item);
        }
      });
    });
    let cyrusHttpUrl = '';
    let cyrusWsUrl = '';
    let xerxesUrl;
    let config: any = {};
    forEach(cyrus, (item) => {
      config = this.parseConfigData(item);
      if (config.protocol === 'http' || config.protocol === 'https') {
        cyrusHttpUrl = this.getCompleteUrl(config);
      } else if (config.protocol === 'ws' || config.protocol === 'wss') {
        cyrusWsUrl = this.getCompleteUrl(config);
      }
    });
    xerxesUrl = this.getCompleteUrl(this.parseConfigData(xerxes[0]));

    return {
      websocket: cyrusWsUrl,
      register: cyrusHttpUrl,
      store: xerxesUrl,
    };
  }

  private parseConfigData(data: any) {
    const items = data.split(':');
    return {
      name: items[0],
      protocol: items[1],
      port: items[2],
      url: items[3],
    };
  }

  private getCompleteUrl(config: any) {
    return config.protocol + '://' + config.url + ':' + config.port;
  }

}

export default Api;

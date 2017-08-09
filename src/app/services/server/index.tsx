/**
 * @file services/server/index.tsx
 * @author -
 * @desc Generates a unique number starting from 1
 * @export {Unique}
 * Documented by: robzizo
 * Date of documentation:  2017-07-25
 * Reviewed by:            -
 * Date of review:         -
 */
import IRequest from './interfaces/IRequest';
import IResponse from './interfaces/IResponse';
import IErrorResponseData from './interfaces/IErrorResponseData';
import AAA from './../aaa/index';
import CONFIG from 'config';
import {Socket, SocketState} from 'services/socket';
import Unique from './../utils/unique';
import Client from 'services/utils/client';

const TIMEOUT_TIME = 24000;

/**
 *
 * @class Server
 * @requires [<AAA>,<Client>]
 */
class Server {

  /**
   * Define socket
   * @private
   * @type {any}
   * @memberof Server
   */
  private socket: any = null;

  /**
   * @name Server#queue
   * @private
   * @type {any}
   * @memberof Server
   */
  private queue: any;

  /**
   * @name Server#reqId
   * @private
   * @type {number}
   * @memberof Server
   */
  private reqId: number = Date.now();

  /**
   * @name Server#cid
   * @private
   * @type {string}
   * @memberof Server
   */
  private cid: string;

  /**
   * @name Server#messageListeners
   * @private
   * @type {object}
   * @memberof Server
   */
  private messageListeners: object = {};

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @memberof Server
   */
  constructor() {
    console.log('Start Server instance');

    /**
     * Assign socket and default values
     */
    this.socket = new Socket({
      server: CONFIG().WEBSOCKET.URL,
      pingPongTime: 10000,
      onMessage: this.response.bind(this),
    });
    this.queue = [];
    this.socket.connect();
    this.cid = Client.getCid();
  }

  /**
   * this method send requests to Server
   * @public
   * @param {IRequest} req
   * @returns {Promise<any>}
   * @memberof Server
   */
  public request(req: IRequest): Promise<any> {

    /**
     * Define aaa
     * @const
     * @type {object}
     */
    const aaa = AAA.getInstance();

    /**
     * Define credential
     * @const
     * @type {object}
     */
    const credential = aaa.getCredentials();
    if (!req._reqid) {
      req._reqid = this.getRequestId();
    }

    /**
     * add client version and client id to the request object
     * @const
     * @type {object}
     */
    const socketRequest: any = {
      ...req,
      _cver: CONFIG().APP_VERSION,
      _cid: this.cid,
    };

    /**
     * add Session key and Session ID to the request object
     * @const
     * @type {object}
     */
    if (credential.sk && credential.sk !== 'null') {
      socketRequest._sk = credential.sk;
    }

    if (credential.ss && credential.ss !== 'null') {
      socketRequest._ss = credential.ss;
    }

    /**
     * Create promise functions for reslove and rejecting the requests
     * @var
     * @callback
     * @type {Promise}
     */
    let internalResolve;
    let internalReject;

    const promise = new Promise((res, rej) => {
      internalResolve = res;
      internalReject = rej;

      if (this.socket.isReady()) {
        this.sendRequest(socketRequest);
      }
    });

    /**
     * Add request to the queue manager
     */
    this.queue.push({
      state: 0,
      reqId: req._reqid,
      resolve: internalResolve,
      reject: internalReject,
      request: socketRequest,
      timeout: this.handleTimeout(req._reqid),
    });

    return promise;
  }

  /**
   * TODO : use this method or delete it
   * @param {function} callback
   * @returns {*}
   * @memberof Server
   */
  public addMessageListener(callback: (syncObj: any) => void): any {
    const listenerId = 'listener_' + Unique.get();
    this.messageListeners[listenerId] = callback;
    const canceler = () => {
      delete this.messageListeners[listenerId];
    };
    return canceler;
  }

  /**
   * add callback function to socket state change event
   * @param {function} callback
   * @memberof Server
   * @public
   */
  public onConnectionStateChange(callback: (state: SocketState) => void) {
    this.socket.onStateChanged = callback;
  }

  /**
   * call all message listener
   * @name Server#callMessageListeners
   * @private
   * @param {object} message
   * @memberof Server
   */
  private callMessageListeners(message: object) {
    Object.keys(this.messageListeners).forEach((key: string) => {
      this.messageListeners[key](message);
    });
  }

  /**
   * Reject the request when server response takes long time
   * @private
   * @memberof Server
   */
  private handleTimeout = (requestId) => {
    return setTimeout(() => {

      /**
       * @const errorData
       * @type {IErrorResponseData}
       */
      const errorData: IErrorResponseData = {
        err_code: 1000,
        items: [],
      };

      /**
       * generate respone object when the server do not respone in enogh time
       */
      const fakeResponse: IResponse = {
        _reqid: requestId,
        status: 'err',
        data: errorData,
      };

      /**
       * send response to the sender service
       */
      this.response(JSON.stringify(fakeResponse));
    }, TIMEOUT_TIME);
  }

  /**
   * generates uniqe ids for request
   * @private
   * @returns {string} reqId
   * @memberof Server
   * @generator
   */
  private getRequestId(): string {
    this.reqId++;
    return 'REQ' + this.reqId;
  }

  /**
   * parse server response to usable object in app
   * @private
   * @param {string} res
   * @returns {object}
   * @memberof Server
   */
  private response(res: string): void {

    /**
     * @const response
     * @type {object}
     */
    const response = JSON.parse(res);

    // start the queue after receiving hi
    if (this.socket.isReady() && response.data.msg === 'hi') {
      this.startQueue();
    }

    this.callMessageListeners(response);

    // try to find queued request
    const itemIndex = this.queue.findIndex((q) => {
      return q.reqId === response._reqid;
    });

    // check for has request in queue
    // return if has any request with this
    if (itemIndex === -1) {
      return;
    }

    /**
     * @const queueItem
     * @type {object}
     */
    const queueItem = this.queue[itemIndex];

    // resole request
    queueItem.resolve(response);

    // log request and response in a group
    // if (console.groupCollapsed) {
    //   console.groupCollapsed(`Server : ${queueItem.request.cmd.toUpperCase()}`);
    // }
    // console.log('Request ', queueItem.request);
    // console.log('Response', response);
    // if (console.groupEnd) {
    //   console.groupEnd();
    // }

    // remove request from queue
    this.queue.splice(itemIndex, 1);
  }

  /**
   * generates string from request and send to the api
   * @private
   * @param {*} request
   * @memberof Server
   */
  private sendRequest(request: any) {
    this.socket.send(JSON.stringify(request));
  }

  /**
   * start sending all queued requests
   * @private
   * @function
   * @memberof Server
   */
  private startQueue() {
    this.queue.map((request) => {
      if (request.state === 0) {
        this.sendRequest(request.request);
      }
    });
  }

}

export {Server, IRequest, IResponse};

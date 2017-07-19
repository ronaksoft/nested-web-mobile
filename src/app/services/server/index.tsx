import IRequest from './interfaces/IRequest';
import IResponse from './interfaces/IResponse';
import IErrorResponseData from './interfaces/IErrorResponseData';
import AAA from './../aaa/index';
import CONFIG from 'config';
import {Socket, SocketState} from 'services/socket';
import Client from 'services/client';
import Unique from './../utils/unique';

const TIMEOUT_TIME = 24000;

class Server {
  private socket: any = null;
  private queue: any;
  private reqId: number = Date.now();
  private cid: string;
  private messageListeners: object = {};

  constructor() {
    console.log('Start Server instance');
    this.socket = new Socket({
      server: CONFIG().WEBSOCKET.URL,
      pingPongTime: 10000,
      onMessage: this.response.bind(this),
    });
    this.queue = [];
    this.socket.connect();
    this.cid = this.getClientId();
  }

  public request(req: IRequest): Promise<any> {
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();
    if (!req._reqid) {
      req._reqid = this.getRequestId();
    }

    const socketRequest: any = {
      ...req,
      _cver: CONFIG().APP_VERSION,
      _cid: this.cid,
    };

    if (credential.sk && credential.sk !== 'null') {
      socketRequest._sk = credential.sk;
    }

    if (credential.ss && credential.ss !== 'null') {
      socketRequest._ss = credential.ss;
    }

    let internalResolve;
    let internalReject;

    const promise = new Promise((res, rej) => {
      internalResolve = res;
      internalReject = rej;

      if (this.socket.isReady()) {
        this.sendRequest(socketRequest);
      }
    });

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

  public addMessageListener(callback: (syncObj: any) => void): any {
    const listenerId = 'listener_' + Unique.get();
    this.messageListeners[listenerId] = callback;
    const canceler = () => {
      delete this.messageListeners[listenerId];
    };
    return canceler;
  }

  public onConnectionStateChange(callback: (state: SocketState) => void) {
    this.socket.onStateChanged = callback;
  }

  private callMessageListeners(message: object) {
    Object.keys(this.messageListeners).forEach((key: string) => {
      this.messageListeners[key](message);
    });
  }

  private handleTimeout = (requestId) => {
    return setTimeout(() => {

      const errorData: IErrorResponseData = {
        err_code: 1000,
        items: [],
      };

      const fakeResponse: IResponse = {
        _reqid: requestId,
        status: 'err',
        data: errorData,
      };

      this.response(JSON.stringify(fakeResponse));
    }, TIMEOUT_TIME);
  }

  private getRequestId(): string {
    this.reqId++;
    return 'REQ' + this.reqId;
  }

  private response(res: string): void {
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

    const queueItem = this.queue[itemIndex];

    // resole request
    queueItem.resolve(response);

    // log request and response in a group
    if (console.groupCollapsed) {
      console.groupCollapsed(`Server : ${queueItem.request.cmd.toUpperCase()}`);
    }
    console.log('Request ', queueItem.request);
    console.log('Response', response);
    if (console.groupEnd) {
      console.groupEnd();
    }

    // remove request from queue
    this.queue.splice(itemIndex, 1);
  }

  private sendRequest(request: any) {
    this.socket.send(JSON.stringify(request));
  }

  private startQueue() {
    this.queue.map((request) => {
      if (request.state === 0) {
        this.sendRequest(request.request);
      }
    });
  }

  private getClientId(): string {
    const deviceName = Client.getDevice();
    const device = deviceName ? 'mobile' : 'desktop';
    const os = deviceName ? deviceName : Client.getOS();
    const browser = Client.getBrowser();

    return ['web', device, browser, os].join('_');
  }

}

export {Server, IRequest, IResponse};

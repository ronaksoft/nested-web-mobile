import {Server, IRequest} from 'services/server';
import {IResponse} from 'services/server';
import Unique from './../services/utils/unique';

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

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  public setHasCredential(value: boolean) {
    this.hasCredential = value;
  }

  public getHasCredential() {
    return this.hasCredential;
  }

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

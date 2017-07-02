import {Server, IRequest} from 'services/server';
import {IResponse} from 'services/server';
import log from 'loglevel';

class Api {
  private hasCredential: boolean = false;
  private static instance;
  private server;

  public static getInstance() {
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

  public request(req: IRequest): Promise <any> {
    return new Promise((resolve, reject) => {
      this.server.request(req).then((response: IResponse) => {
        if (!response) {
          log.error('Response could not be empty!');
        }

        if (response.status === 'ok') {
          resolve(response.data);
        } else {
          reject (response.data);
        }
      }).catch((error) => {
        log.error(error);
        reject(error);
      });
    });
  }

  private constructor() {
    this.server = Server.getInstance();
    console.log('Start Api instance');
  }

}

export default Api;

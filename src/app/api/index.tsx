import {Server, IRequest} from 'services/server';
import {IResponse} from 'services/server';

class Api {
  private hasCredential: boolean = false;
  private static instance;
  private server;

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

  public request(req: IRequest): Promise <any> {
    return new Promise((resolve, reject) => {
      this.getServer().request(req).then((response: IResponse) => {
        if (response.status === 'ok') {
          resolve(response.data);
        } else {
          reject (response.data);
        }
      }).catch(reject);
    });
  }

  private getServer() {
    if (!this.server) {
      this.server = new Server();
    }

    return this.server;
  }

}

export default Api;

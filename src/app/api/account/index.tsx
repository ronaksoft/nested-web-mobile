import Api from 'api';
import {
  IRecallRequest,
  IRecallResponse,
  IGetRequest,
  ILoginRequest,
  ILoginResponse,
} from './interfaces';
import IUser from './interfaces/IUser';

export default class AccountApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public recall(data: IRecallRequest): Promise<IRecallResponse> {
    return this.api.request({
      cmd: 'session/recall',
      data,
      withoutQueue: true,
    });
  }

  public get(data: IGetRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'account/get',
      data,
    }).then((res: any) => {
      const user = res.data as IUser;
      return user;
    }).catch((err) => {
      console.log(err);
    });
  }

  public login(data: ILoginRequest): Promise<ILoginResponse> {
    return this.api.request({
      cmd: 'session/register',
      data,
    });
  }

  public logout(): Promise<any> {
    return this.api.request({
      cmd: 'session/close',
    });
  }
}

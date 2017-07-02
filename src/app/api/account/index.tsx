import Api from 'api';
import IRecallRequest from './interfaces/IRecallRequest';
import IRecallResponse from './interfaces/IRecallResponse';
import IGetRequest from './interfaces/IGetRequest';
import IUser from './interfaces/IUser';

export default class AccountApi {
    private api;

    constructor() {
        this.api = Api.getInstance();
    }

    public recall(data: IRecallRequest): Promise<any> {
        return this.api.request({
            cmd: 'session/recall',
            data,
            withoutQueue: true,
        }).then((res: IRecallResponse) => {
            return res;
        });
    }

    public get(data: IGetRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'account/get',
            data,
        }).then((res: IUser) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    }

    public login(data: any): Promise<any> {
      return this.api.server.request({
        cmd: 'session/register',
        data,
      }).then((res: any) => {
        return res;
      }).catch((err) => {
        console.log(err);
      });
    }

    public logout(): Promise<any> {
      return this.api.server.request({
        cmd: 'session/close',
      }).then((res: any) => {
        return res;
      }).catch((err) => {
        console.log(err);
      });
    }
}

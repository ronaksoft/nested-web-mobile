import Api from 'api';
import {
  IRecallRequest,
  IRecallResponse,
  IGetRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IGetVerificationRequest,
  IPhoneAvailableRequest,
  IVerifyCodeRequest,
  IGetVerificationResponse,
  ISendTextRequest,
  ICallPhoneRequest,
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
        }).then((res: IUser) => {
            return res;
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


  public register(data: IRegisterRequest): Promise <any> {
    return this.api.request({
      cmd: 'account/register_user',
      data,
    });
  }

  public getVerification(data: IGetVerificationRequest): Promise<IGetVerificationResponse> {
    return this.api.request({
      cmd: 'auth/get_verification',
      data,
    });
  }

  public phoneAvailable(data: IPhoneAvailableRequest): Promise<boolean> {
    return this.api.request({
      cmd: 'auth/phone_available',
      data,
    });
  }

  public verifyCode(data: IVerifyCodeRequest): Promise<any> {
    return this.api.request({
      cmd: 'auth/verify_code',
      data,
    });
  }

  public sendText(data: ISendTextRequest): Promise<any> {
    return this.api.request({
      cmd: 'auth/send_text',
      data,
    });
  }

  public callPhone(data: ICallPhoneRequest): Promise<any> {
    return this.api.request({
      cmd: 'auth/call_phone',
      data,
    });
  }
}

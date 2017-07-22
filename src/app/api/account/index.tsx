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
  IUsernameAvailable,
} from './interfaces';
import IPlace from '../place/interfaces/IPlace';

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
    return this.api.request({
      cmd: 'account/get',
      data,
    });
  }

  public getFavoritePlaces(): Promise<string[]> {
    return this.api.request({
      cmd: 'account/get_favorite_places',
    }).then((data) => {
      return data.places.map((place: IPlace) => {
        return place._id;
      });
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

  public register(data: IRegisterRequest): Promise<any> {
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

  public usernameAvailable(data: IUsernameAvailable): Promise<boolean> {
    return new Promise((resolve) => {
      return this.api.request({
        cmd: 'account/available',
        data,
      }).then(() => {
        resolve(true);
      }, () => {
        resolve(false);
      });
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

/**
 * @file api/account/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Server APIs which are related to a user account
 * Documented by:           Soroush Torkzadeh
 * Date of documentation:   2017-07-26
 * Reviewed by:             robzizo
 * Date of review:          2017-07-31
 */
import Api from 'api';
import RequestBundle from '../requestBundle';
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
  IChangePhoneRequest,
  IProfile,
} from './interfaces';
import {IPlace} from '../interfaces/';

/**
 * @class AccountApi
 * @desc Cyrus APIs which are related to a user account
 * @export
 */
export default class AccountApi {
  private api;

  /**
   * @prop requestBundle
   * @desc An instance of requestBundle
   * @private
   * @memberof CommentApi
   */
  private requestBundle: RequestBundle;

  /**
   * Creates an instance of AccountApi.
   * @memberof AccountApi
   */
  constructor() {
    this.api = Api.getInstance();
    this.requestBundle = RequestBundle.getInstance();
  }

  /**
   * @func recall
   * @desc Checks the given session-key (sk) and session-secret (ss) with Server
   * @param {IRecallRequest} data
   * @returns {Promise<IRecallResponse>}
   * @memberof AccountApi
   */
  public recall(data: IRecallRequest): Promise<IRecallResponse> {

    /**
     * check if `nested.server.domain` did exist in local storage get configs for that domain and make recall request
     */
    if (localStorage.getItem('nested.server.domain')) {
      return this.api.reconfigEndPoints(localStorage.getItem('nested.server.domain'))
        .then(() => {
          return this.api.request({
            cmd: 'session/recall',
            data,
            withoutQueue: true,
          });
        });
    } else {
      return this.api.request({
        cmd: 'session/recall',
        data,
        withoutQueue: true,
      });
    }
  }

  /**
   * @func get
   * @desc Retrieves the current user account data
   * @param {IGetRequest} data
   * @returns {Promise<any>}
   * @memberof AccountApi
   */
  public get(data: IGetRequest): Promise<any> {
    // return this.api.request({
    //   cmd: 'account/get',
    //   data,
    // });
    // console.log(this.requestBundle);
    return this.requestBundle.observeRequest('account', data.account_id, false, '_id', 'accounts', this.getManyPrivate);
  }

  /**
   * @func getMany
   * @desc Retrieves the current user account data
   * @param {IGetRequest} data
   * @returns {Promise<any>}
   * @memberof AccountApi
   */
  public getMany(data: IGetRequest): Promise<any> {
    return this.requestBundle.observeRequest('account', data.account_id, true, '_id', 'accounts', this.getManyPrivate);
  }

  /**
   * @func get
   * @desc Retrieves the current user account data
   * @param {string} ids
   * @memberof AccountApi
   */
  private getManyPrivate(ids: string) {
    const data: IGetRequest = {
      account_id: ids,
    };
    return {
      cmd: 'account/get_many',
      data,
    };
  }

  /**
   * @func getFavoritePlaces
   * @desc Returns a list of the current user favorite places
   * @returns {Promise<string[]>}
   * @memberof AccountApi
   */
  public getFavoritePlaces(): Promise<string[]> {
    return this.api.request({
      cmd: 'account/get_favorite_places',
    }).then((data) => {
      return data.places.map((place: IPlace) => {
        return place._id;
      });
    });
  }

  /**
   * @func login
   * @desc Registers a new session with the given username and password
   * @param {ILoginRequest} data
   * @returns {Promise<ILoginResponse>}
   * @memberof AccountApi
   */
  public login(data: ILoginRequest): Promise<ILoginResponse> {
    return this.api.request({
      cmd: 'session/register',
      data,
    });
  }

  /**
   * @func logout
   * @desc Removes (closes) the current user session
   * @returns {Promise<any>}
   * @memberof AccountApi
   */
  public logout(): Promise<any> {
    return this.api.request({
      cmd: 'session/close',
    });
  }

  public getActiveSessions(): Promise<any> {
    return this.api.request({
      cmd: 'session/get_actives',
      data: {},
    });
  }

  public closeSession(sk: string): Promise<any> {
    return this.api.request({
      cmd: 'session/close_active',
      data: {
        _sk: sk,
      },
    });
  }

  public closeAllSessions(): Promise<any> {
    return this.api.request({
      cmd: 'session/close_all_actives',
      data: {},
    });
  }

  /**
   * @desc Creates an account using a verification Id (vid) which should be verified before
   * @func register
   * @param {IRegisterRequest} data
   * @returns {Promise<any>}
   * @memberof AccountApi
   * @see verifyCode
   */
  public register(data: IRegisterRequest): Promise<any> {
    return this.api.request({
      cmd: 'account/register_user',
      data,
    });
  }

  /**
   * @func getVerification
   * @desc Requests a verification code for the given phone number
   * @param {IGetVerificationRequest} data
   * @returns {Promise<IGetVerificationResponse>}
   * @memberof AccountApi
   */
  public getVerification(data: IGetVerificationRequest): Promise<IGetVerificationResponse> {
    return this.api.request({
      cmd: 'auth/get_verification',
      data,
    });
  }

  /**
   * @func phoneAvailable
   * @desc Check the phone number to be available for registration
   * @param {IPhoneAvailableRequest} data
   * @returns {Promise<boolean>}
   * @memberof AccountApi
   */
  public phoneAvailable(data: IPhoneAvailableRequest): Promise<boolean> {
    return new Promise((resolve) => {
      return this.api.request({
        cmd: 'auth/phone_available',
        data,
      }).then(() => resolve(true), () => resolve(false));
    });
  }

  /**
   * @desc Asks Server whether the username is available for registration or not
   * @func usernameAvailable
   * @param {IUsernameAvailable} data
   * @returns {Promise<boolean>}
   * @memberof AccountApi
   */
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

  /**
   * @func verifyCode
   * @desc Verifies the 6-digit code that was sent to the user
   * @param {IVerifyCodeRequest} data
   * @returns {Promise<any>}
   * @memberof AccountApi
   */
  public verifyCode(data: IVerifyCodeRequest): Promise<any> {
    return this.api.request({
      cmd: 'auth/verify_code',
      data,
    });
  }

  /**
   * @func sendText
   * @desc Sends an SMS to the given phone number
   * @param {ISendTextRequest} data
   * @returns {Promise<any>}
   * @memberof AccountApi
   */
  public sendText(data: ISendTextRequest): Promise<any> {
    return this.api.request({
      cmd: 'auth/send_text',
      data,
    });
  }

  /**
   * @func callPhone
   * @desc Requests a phone call for the given phone number to get the verification code
   * @param {ICallPhoneRequest} data
   * @returns {Promise<any>}
   * @memberof AccountApi
   */
  public callPhone(data: ICallPhoneRequest): Promise<any> {
    return this.api.request({
      cmd: 'auth/call_phone',
      data,
    });
  }

  public update(data: IProfile): Promise<any> {
    return this.api.request({
      cmd: 'account/update',
      data,
    });
  }

  public updatePhone(data: IChangePhoneRequest): Promise<any> {
    return this.api.request({
      cmd: 'account/change_phone',
      data,
    });
  }

  public setPassword(oldPass: string, newPass: string): Promise<any> {
    return this.api.request({
      cmd: 'account/set_password',
      data: {
        old_pass: oldPass,
        new_pass: newPass,
      },
    });
  }

  public setPicture(uid: string): Promise<any> {
    return this.api.request({
      cmd: 'account/set_picture',
      data: {
        universal_id: uid,
      },
    });
  }

}

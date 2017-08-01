/**
 * @file api/invitation/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc APIs are related to invitation
 * @export InvitationApi
 * @exports {RespondType}
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-26
 * Reviewed by:           robzizo
 * Date of review:        2017-07-31
 */

import Api from 'api';
import IRespondInvitationRequest from './interfaces/IRespondInvitationRequest';
import RespondType from './interfaces/RespondType';

/**
 * @class InvitationApi
 * @desc APIs are related to invitation
 */
export default class InvitationApi {
  /**
   * @prop api
   * @desc An instance of base Api
   * @private
   * @memberof InvitationApi
   */
  private api;

  /**
   * Creates an instance of InvitationApi.
   * @memberof InvitationApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func respond
   * @desc Accepts/Rejects an invitation based on the given response
   * @param {IRespondInvitationRequest} data
   * @returns {Promise<any>}
   * @memberof InvitationApi
   */
  public respond(data: IRespondInvitationRequest): Promise<any> {
    return this.api.request({
      cmd: 'account/respond_invite',
      data,
    });
  }
};

export {RespondType};

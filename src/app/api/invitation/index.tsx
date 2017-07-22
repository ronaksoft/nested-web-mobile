import Api from 'api';
import IRespondInvitationRequest from './interfaces/IRespondInvitationRequest';
import RespondType from './interfaces/RespondType';

export default class InvitationApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public respond(data: IRespondInvitationRequest): Promise<any> {
    return this.api.request({
      cmd: 'account/respond_invite',
      data,
    });
  }
};

export {RespondType};

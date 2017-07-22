import RespondType from './RespondType';

interface IRespondInvitationRequest {
  invite_id: string;
  response: RespondType;
}

export default IRespondInvitationRequest;
export {RespondType};
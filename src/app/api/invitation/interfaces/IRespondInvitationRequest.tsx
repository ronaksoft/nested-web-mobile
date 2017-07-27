/**
 * @file api/invitation/interfaces/IRespondInvitationRequest.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Interface of responding an invitation
 * @export IRespondInvitationRequest
 * @exports {RespondType}
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-27
 * Reviewed by:           -
 * Date of review:        -
 */

import RespondType from './RespondType';

interface IRespondInvitationRequest {
  invite_id: string;
  response: RespondType;
}

export default IRespondInvitationRequest;
export {RespondType};
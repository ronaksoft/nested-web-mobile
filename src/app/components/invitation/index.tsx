/**
 * @file component/invitation/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the invitation modal component. Component gets the
 *              requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {PlaceItem, IcoN} from 'components';
import InvitationApi from 'api/invitation';

const style = require('./invitation.css');

interface IProps {
  inv: any;
  onAccept: () => void;
  onDecline: () => void;
  onDismiss: () => void;
}

interface IState {
  place: IPlace | null;
}

/**
 * invitation modal handles accept or decline of invitation
 * @class Invitation
 * @extends {React.Component<IProps, IState>}
 */
class Invitation extends React.Component<IProps, IState> {

  // define invitation api
  private invitationApi: InvitationApi;

  /**
   * Creates an instance of Invitation.
   * @constructor
   * @param {object} props
   * @memberof Invitation
   */
  constructor(props: any) {
    super(props);

    /**
     * initial data set to prevent errors
     * @type {object}
     * @property {any} place the invited place
     */
    this.state = {
      place: null,
    };

    this.invitationApi = new InvitationApi();
  }

  /**
   * Documented as Invitation.accpet
   * @func
   * @desc invitation accept method and notify parent of the action
   * @private
   * @memberof Invitation
   */
  private accept = () => {
    this.invitationApi.respond({
      invite_id: this.props.inv._id,
      response: 'accept',
    }).then(() => {
      if (this.props.onAccept) {
        this.props.onAccept();
      }
    });
  }

  /**
   * Documented as Invitation.decline
   * @func
   * @desc invitation decline method and notify parent of the action
   * @private
   * @memberof Invitation
   */
  private decline = () => {
    this.invitationApi.respond({
      invite_id: this.props.inv._id,
      response: 'ignore',
    }).then(() => {
      if (this.props.onDecline) {
        this.props.onDecline();
      }
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Invitation
   * @lends Invitation
   */
  public render() {
    return (
      <div className={style.invitation}>
        {/* invitation place info */}
        <PlaceItem place_id={this.props.inv.place._id} size={64} borderRadius="6px"/>
        <h2>{this.props.inv.place.name}</h2>
        <p>{this.props.inv.place.description}</p>
        {/* inviter info */}
        <span>Invitation from <b>{this.props.inv.inviter.fname} {this.props.inv.inviter.lname}</b></span>
        <div className={style.buttons}>
          {/* decline button for invitation */}
            <button className={style.btnWhite} onClick={this.decline}>Decline</button>
            <div className={style.devider}/>
            {/* accept button for invitation */}
            <button className={style.btnGreen} onClick={this.accept}>Accept</button>
        </div>
        {/* dissmiss the invitation modal */}
        <div className={style.close} onClick={this.props.onDismiss}>
            <IcoN size={24} name={'xcross24'}/>
        </div>
      </div>
    );
  }
}

export {Invitation}

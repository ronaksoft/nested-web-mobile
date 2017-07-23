/**
 * @file component/InvitationItem/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Invitation list item also shows the invitation modal for accept
 *              or decline the invitation. Component gets the required data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            sina
 *              Date of review:         2017-07-23
 */
import * as React from 'react';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';
import {IcoN, Invitation} from 'components';

const style = require('./invitationItem.css');

interface IInvitationItemProps {
  item: any; // TODO:: define interface of item
  key: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

interface IInvitationItemState {
  modal: boolean;
}

/**
 * @class InvitationItem
 * @classdesc manage the invitation actions and renders the JSX element in sidebar
 * @extends {React.Component<IInvitationItemProps, IInvitationItemState>}
 */
class InvitationItem extends React.Component<IInvitationItemProps, IInvitationItemState> {

  /**
   * @constructor
   * Creates an instance of InvitationItem.
   * @param {IInvitationItemProps} props
   * @memberof InvitationItem
   */
  constructor(props: any) {
    super(props);

    /**
     * Initial state object
     * @default
     * @type {object}
     * @property {boolean} modal - The condition for invitation modal view
     */
    this.state = {
      modal: false,
    };
  }

  /**
   * display the invitation modal by set `modal` state as True
   * @private
   * @memberof InvitationItem
   */
  private invitationModal() {
    this.setState({
      modal: true,
    });
  }

  /**
   * Register a handler function to be called whenever this invitation accepted
   * in related component and close modal.
   * @private
   * @memberof InvitationItem
   */
  private handleAccept = () => {

    // Close the modal after the action
    this.setState({
      modal: false,
    });

    // notify parent to accepted invitation
    if (this.props.onAccept) {
      this.props.onAccept();
    }
  }

  /**
   * Register a handler function to be called whenever this invitation declined
   * in related component and close modal.
   * @private
   * @memberof InvitationItem
   */
  private handleDecline = () => {

    // Close the modal after the action
    this.setState({
      modal: false,
    });

    // notify parent to declined invitation
    if (this.props.onDecline) {
      this.props.onDecline();
    }
  }

  /**
   * close the invitation modal
   * @private
   * @memberof InvitationItem
   */
  private handleDismiss = () => {
    this.setState({
      modal: false,
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof InvitationItem
   * @lends InvitationItem
   */
  public render() {

    // fixme:: define interfaces for each variable or constant

    /**
     * @const place the invited place
     * @type IPlace
     */
    const place = this.props.item.place;

    /**
     * @const inviter user
     * @type IUser
     */
    const inviter = this.props.item.inviter;
    let img;

    /**
     * generate the place picture JSX element and the url.
     * use a placeholder for places without picture
     */
    if (place.picture.length > 0) {
      img = (
        <img className={style.picture}
             src={`${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${place.picture}`}/>
      );
    } else {
      img = (
        <IcoN size={24} name={'absentPlace24'}/>
      );
    }

    return (
      <li key={this.props.key}>
        {/* on click invitation item the invitation modal appears */}
        <div className={style.place} onClick={this.invitationModal.bind(this, '')}>
          {img}
          <div>
            <span>{inviter.fname + ' ' + inviter.lname} invited you to:</span>
            <a>{place.name}</a>
          </div>
        </div>
        <hr className={style.hrDark}/>
        <hr className={style.hrLight}/>
        {/* invitation modal and its visibility condition */}
        {
          this.state.modal &&
          (
            <Invitation
              inv={this.props.item}
              onAccept={this.handleAccept}
              onDecline={this.handleDecline}
              onDismiss={this.handleDismiss}
            />
          )
        }
      </li>
    );
  }
}

export {InvitationItem}

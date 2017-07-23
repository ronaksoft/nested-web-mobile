/**
 * @file component/InvitationItem/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Invitation list item also shows the invitation modal for accept
 *              or decline the invitation. Component gets the requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
// import IPlaceConjuction from '../../api/place/interfaces/IPlaceConjuction';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';
import {IcoN, Invitation} from 'components';

const style = require('./invitationItem.css');

interface IInvitationItemProps {
  item: any; // TODO define interface of item
  key: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

interface IInvitationItemState {
  modal: boolean;
}

/**
 * this class manage the inivitation actions and renders the JSX element in sidebar
 * @class InvitationItem
 * @extends {React.Component<IInvitationItemProps, IInvitationItemState>}
 */
class InvitationItem extends React.Component<IInvitationItemProps, IInvitationItemState> {

  /**
   * @constructor
   * Creates an instance of InvitationItem.
   * @param {object} props
   * @memberof InvitationItem
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {boolean} modal - The condition for invitation modal view
     */
    this.state = {
      modal: false,
    };
  }

  /**
   * display the invitation modal
   * @private
   * @memberof InvitationItem
   */
  private inivtationModal() {
      this.setState({
          modal: true,
      });
  }

  /**
   * Register a handler function to be called whenever this invitation accepted
   * in related component
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
   * in related component
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
   * close the inivtation modal
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

    /**
     * @namespace
     * place - the invited place
     * inviter - the user object of the inviter
     * img - image of place in sidebar invistation JSX element
     */
    const place = this.props.item.place;
    const inviter = this.props.item.inviter;
    let img;

    /**
     * generate the place picture JSX elemeng and the url.
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
        <div className={style.place} onClick={this.inivtationModal.bind(this, '')}>
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

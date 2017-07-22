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

class Invitation extends React.Component<IProps, IState> {
  private invitationApi: InvitationApi;
  constructor(props: any) {
    super(props);
    this.state = {
      place: null,
    };

    this.invitationApi = new InvitationApi();
  }

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

  public render() {

    return (
      <div className={style.invitation}>
        <PlaceItem place_id={this.props.inv.place._id} size={64} borderRadius="6px"/>
        <h2>{this.props.inv.place.name}</h2>
        <p>{this.props.inv.place.description}</p>
        <span>Invitation from <b>{this.props.inv.inviter.fname} {this.props.inv.inviter.lname}</b></span>
        <div className={style.buttons}>
            <button className={style.btnWhite} onClick={this.decline}>Decline</button>
            <div className={style.devider}/>
            <button className={style.btnGreen} onClick={this.accept}>Accept</button>
        </div>
        <div className={style.close} onClick={this.props.onDismiss}>
            <IcoN size={24} name={'xcross24'}/>
        </div>
      </div>
    );
  }
}

export {Invitation}

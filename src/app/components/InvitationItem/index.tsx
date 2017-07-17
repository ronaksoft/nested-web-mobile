 import * as React from 'react';
// import IPlaceConjuction from '../../api/place/interfaces/IPlaceConjuction';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';
import {IcoN, Invitation} from 'components';

const style = require('./invitationItem.css');

interface IInvitationItemProps {
  item: any;
  key: string;
}

interface IInvitationItemState {
  modal: boolean;
}

class InvitationItem extends React.Component<IInvitationItemProps, IInvitationItemState> {

  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.inivtationModal = this.inivtationModal.bind(this);
  }

  private inivtationModal() {
      this.setState({
          modal: true,
      });
  }

  private closeModal() {
    this.setState({
        modal: false,
    });
  }

  public render() {
    const place = this.props.item.place;
    const inviter = this.props.item.inviter;
    let img;
    if (place.picture.length > 0) {
        img = (
            <img className={style.picture}
            src={`${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${place.picture}`}/>
        );
    } else {
        img = (
            <IcoN size={24} name={'absentPlace24'}/>
        );
    }
    return (
      <li key={this.props.key} onClick={this.inivtationModal}>
        <div className={style.place}>
            {img}
            <div>
                <span>{inviter.fname + ' ' + inviter.lname} invited you to:</span>
                <a>{place.name}</a>
            </div>
        </div>
        <hr className={style.hrDark}/>
        <hr className={style.hrLight}/>
        {this.state.modal && <Invitation inv={this.props.item} onClose={this.closeModal}/>}
    </li>
    );
  }
}

export {InvitationItem}

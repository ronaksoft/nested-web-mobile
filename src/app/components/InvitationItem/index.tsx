 import * as React from 'react';
import IPlaceConjuction from '../../api/place/interfaces/IPlaceConjuction';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';
import {IcoN} from 'components';

const style = require('./invitationItem.css');

interface IInvitationItemProps {
  place: IPlaceConjuction;
  i: number;
}

class InvitationItem extends React.Component<IInvitationItemProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    let img;
    if (this.props.place.picture.length > 0) {
        img = (
            <img className={style.picture}
            src={`${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${this.props.place.picture}`}/>
        );
    } else {
        img = (
            <IcoN size={24} name={'absentPlace24'}/>
        );
    }
    return (
      <li key={this.props.i + this.props.place.id + 'c'}>
        <div className={style.place}>
            {img}
            <div>
                <span>August Zetterberg invited you to:</span>
                <a>{this.props.place.name}</a>
            </div>
        </div>
            <hr className={style.hrDark}/>
            <hr className={style.hrLight}/>
        </li>
    );
  }
}

export {InvitationItem}

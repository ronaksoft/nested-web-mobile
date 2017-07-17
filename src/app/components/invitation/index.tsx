import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {PlaceItem, IcoN} from 'components';

const style = require('./invitation.css');

interface IProps {
  inv: any;
  onClose: () => void;
}

interface IState {
  place: IPlace | null;
}

class Invitation extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      place: null,
    };
  }

  public componentDidMount() {
    console.log('yes');
  }

  public accept() {
    console.log('yes');
  }

  public decline() {
    console.log('yes');
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
        <div className={style.close} onClick={this.props.onClose.bind(this, '')}>
            <IcoN size={24} name={'xcross24'}/>
        </div>
      </div>
    );
  }
}

export {Invitation}

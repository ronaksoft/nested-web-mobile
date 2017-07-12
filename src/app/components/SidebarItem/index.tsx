 import * as React from 'react';
import IPlaceConjuction from '../../api/place/interfaces/IPlaceConjuction';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';
import {IcoN} from 'components';

const style = require('./sidebarItem.css');

interface ISidebarItemProps {
  place: IPlaceConjuction;
  openChild: () => void;
  i: number;
}

class SidebarItem extends React.Component<ISidebarItemProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    const placeIndent = [];
    const src = this.props.place.picture ?
        `${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${this.props.place.picture}` :
        './../../../assets/icons/absents_place.svg';
    for (let i: number = 0; i < this.props.place.depth; i++) {
        placeIndent.push(
            <div key={this.props.place.id + i} className={style.indent}/>,
        );
    }
    return (
      <li key={this.props.place.id + this.props.i}>
        {!this.props.place.isChildren &&
            <hr className={style.hrDark}/>
        }
        {!this.props.place.isChildren &&
            <hr className={style.hrLight}/>
        }
        <div className={style.place}>
            {placeIndent}
            <img src={src}/>
            <span>{this.props.place.name}</span>
            {this.props.place.unreadPosts > 0 &&
            <b>{this.props.place.unreadPosts}</b>
            }
            {this.props.place.hasChildren &&
            (
                <div className={[style.childArrow, this.props.place.isOpen ? style.active : null].join(' ')}
                onClick={this.props.openChild}>
                <IcoN size={16} name={'arrow16White'}/>
                </div>
            )
            }
        </div>
        </li>
    );
  }
}

export {SidebarItem}

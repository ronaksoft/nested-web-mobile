 import * as React from 'react';
import IPlaceConjuction from '../../api/place/interfaces/IPlaceConjuction';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';
import {IcoN} from 'components';

const style = require('./sidebarItem.css');

interface ISidebarItemProps {
  place: IPlaceConjuction;
  openChild: () => void;
  key: string;
}

class SidebarItem extends React.Component<ISidebarItemProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    const placeIndent = [];
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
    for (let i: number = 0; i < this.props.place.depth; i++) {
        placeIndent.push(
            <div key={this.props.place.id + i + 'b'} className={style.indent}/>,
        );
    }
    console.log(this.props.place.id + this.props.i + 'a');
    return (
      <li key={this.props.key}>
        {!this.props.place.isChildren &&
            <hr className={style.hrDark}/>
        }
        {!this.props.place.isChildren &&
            <hr className={style.hrLight}/>
        }
        <div className={style.place}>
            {placeIndent}
            {img}
            <div className={style.indent}/>
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

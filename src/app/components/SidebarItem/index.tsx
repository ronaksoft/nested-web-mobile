 import * as React from 'react';
import ISidebarPlace from '../../api/place/interfaces/ISidebarPlace';
import {IcoN, PlaceItem, PlaceName} from 'components';

const style = require('./sidebarItem.css');

interface ISidebarItemProps {
  place: ISidebarPlace;
  openChild: () => void;
  key: string;
}

class SidebarItem extends React.Component<ISidebarItemProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    const placeIndent = [];
    for (let i: number = 0; i < this.props.place.depth; i++) {
        placeIndent.push(
            <div key={this.props.place.id + i + 'b'} className={style.indent}/>,
        );
    }
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
            <PlaceItem place_id={this.props.place.id} size={24} borderRadius="0"/>
            <div className={style.indent}/>
            <PlaceName place_id={this.props.place.id}/>
            {/*{this.props.place.unreadPosts > 0 &&
            <b>{this.props.place.unreadPosts}</b>
            }*/}
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

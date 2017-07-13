 import * as React from 'react';
import ISidebarPlace from '../../api/place/interfaces/ISidebarPlace';
import {IcoN, PlaceItem, PlaceName} from 'components';

const style = require('./sidebarItem.css');

interface ISidebarItemProps {
  place: ISidebarPlace;
  openChild: () => void;
  key: string;
  childrenUnread: boolean;
  unreads: number;
}

class SidebarItem extends React.Component<ISidebarItemProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    const placeIndent = [];
    console.log(this.props.unreads, this.props.childrenUnread);
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
            {this.props.unreads > 0 &&
                <b>{this.props.unreads}</b>
            }
            <div className={[style.childArrow, this.props.place.isOpen ? style.active : null].join(' ')}
                onClick={this.props.openChild}>
                {this.props.childrenUnread &&
                    <IcoN size={8} name={'circle8blue'}/>
                }
                {this.props.place.hasChildren &&
                    <IcoN size={16} name={'arrow16White'}/>
                }
            </div>
        </div>
        </li>
    );
  }
}

export {SidebarItem}

import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import ILeftItem from './ILeftItem';
import IRightItem from './IRightItem';
import {IcoN} from 'components';
const style = require('./OptionsMenu.css');

interface IOptionsMenuProps {
  leftItem?: ILeftItem;
  rightItems?: IRightItem[];
  item?: IPlace | null;
  isCheckedIndex?: number;
}
interface IOptionsMenuState {
  titlePopup?: boolean;
  iconIPopup?: boolean;
  iconIIPopup?: boolean;
  isFeed?: boolean;
}

class OptionsMenu extends React.Component<IOptionsMenuProps, IOptionsMenuState> {

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
      isFeed : this.props.item ? false : false,
    });
  }

  public openPopUp = (wrapper: string) => {
    const key = wrapper + 'Popup';
    this.setState({
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
    });
    this.setState({
      [key]: !this.state[key],
    });
  }

  public render() {
    // console.log('aaa', this.props);
    const showOverlay = this.state.titlePopup || this.state.iconIPopup || this.state.iconIIPopup;
    const LeftItemMenuDOM = [];
    this.props.leftItem.menu.forEach((menuItem) => {
      LeftItemMenuDOM.push(
        <li className={menuItem.isChecked ? style.activeItem : null}>
          <div>
            <IcoN size={16} name={menuItem.icon.name}/>
          </div>
          <div>
            <span>{menuItem.name}</span>
            { menuItem.isChecked &&
              <IcoN size={16} name="heavyCheck16"/>
            }
          </div>
        </li>,
      );
    });
    const rightMenuItemsDOMS = [];
    const rightMenuIconDOMS = [];
    this.props.rightItems.forEach((item) => {
      const secondItems = [];
      item.menu.forEach((menuItem) => {
        secondItems.push(
          // Need develops :
          <li className={style.activeItem}>
            {menuItem.name}
          </li>,
        );
      });
      const DOM = (
        this.state[item.type + 'Popup'] &&
        <div className={style.invisible}>
          // TODO : develops
          <ul>
            {secondItems}
          </ul>
        </div>
      );
      rightMenuItemsDOMS.push(DOM);
      const iconDOM = (
        <div className={this.state[item.type + 'Popup'] ? style.icon + ' ' + style.active : style.icon}
          onClick={this.openPopUp.bind(this, item.type)}>
            <IcoN size={24} name={item.name}/>
          </div>
      );
      rightMenuIconDOMS.push(iconDOM);
    });
    return (
    <div className={style.container}>
      <div className={style.visible}>
        <a onClick={this.openPopUp.bind(this, 'title')}
          className={this.state.titlePopup ? style.title + ' ' + style.active : style.title}>
            {this.props.leftItem.name}
          {this.props.leftItem.place &&
            <IcoN size={24} name="arrowSense24"/>
          }
        </a>
        <div className={style.filler}/>
        <div className={style.rightItems}>
          {rightMenuIconDOMS}
        </div>
      </div>
      { this.state.titlePopup &&
        <div className={style.invisible}>
          <ul className={style.titlePopup}>
            {LeftItemMenuDOM}
          </ul>
        </div>
      }
      {rightMenuItemsDOMS}
      { showOverlay &&
        <div className={style.overlay}/>
      }
    </div>
    );
  }
}

export {OptionsMenu}

import * as React from 'react';
import ILeftItem from './ILeftItem';
import IRightItem from './IRightItem';
import {IcoN} from 'components';

const style = require('./OptionsMenu.css');

interface IOptionsMenuProps {
  leftItem?: ILeftItem;
  rightItems?: IRightItem[];
}

interface IOptionsMenuState {
  titlePopup?: boolean;
  iconIPopup?: boolean;
  iconIIPopup?: boolean;
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
    });
  }

  public openPopUp = (wrapper: string) => {
    const key = wrapper + 'Popup';
    let state;
    state = {
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
    };
    state[key] = !this.state[key];
    this.setState(state);
  }

  private renderLeftItems = () => {
    const LeftItemMenuDOM = [];
    this.props.leftItem.menu.forEach((menuItem, index) => {
      LeftItemMenuDOM.push(
        <li key={menuItem.name + index} className={menuItem.isChecked ? style.activeItem : null}
        onClick={menuItem.onClick}>
          <div>
            <IcoN size={16} name={menuItem.icon.name}/>
          </div>
          <div>
            <span>{menuItem.name}</span>
            {menuItem.isChecked &&
            <IcoN size={16} name="heavyCheck16"/>
            }
          </div>
        </li>,
      );
    });
    return LeftItemMenuDOM;
  }

  private renderRightMenus = () => {

    const rightMenuItemsDOMS = [];
    const rightMenuIconDOMS = [];
    this.props.rightItems.forEach((item) => {
      const typeStr = item.type + 'Popup';
      const childrens = [];
      item.menu.forEach((menuItem) => {
        childrens.push(
          // Need develops :
          <li key={menuItem.name.replace(' ', '') + item.type}
          onClick={menuItem.onClick}
          className={[menuItem.isChecked ? style.activeItem : null,
          menuItem.type === 'kind' ? style.kindItem : null].join(' ')}>
            {item.type === 'iconII' &&
              <IcoN size={16} name={menuItem.icon.name}/>
            }
            <span>{menuItem.name}</span>
            {menuItem.isChecked &&
              <IcoN size={16} name="heavyCheck16"/>
            }
          </li>,
        );
      });
      const DOM = (
        this.state[typeStr] &&
        (
          <div key={item.type + 'ng'} className={style.invisible}>
            <ul className={style[typeStr]}>
              {childrens}
            </ul>
          </div>
        )
      );
      rightMenuItemsDOMS.push(DOM);
      const iconDOM = (
        <div key={item.type + 'hg'} className={this.state[typeStr] ? style.icon + ' ' + style.active : style.icon}
             onClick={this.openPopUp.bind(this, item.type)}>
          <IcoN size={24} name={item.name}/>
        </div>
      );
      rightMenuIconDOMS.push(iconDOM);
    });

    return {
      rightMenuItemsDOMS,
      rightMenuIconDOMS,
    };
  }

  public render() {
    // console.log('aaa', this.props);
    const showOverlay = this.state.titlePopup || this.state.iconIPopup || this.state.iconIIPopup;

    const rightMenu = this.renderRightMenus();

    return (
      <div className={style.container}>
        <div className={style.visible}>
          <a onClick={this.openPopUp.bind(this, this.props.leftItem.type)}
             className={this.state.titlePopup ? style.title + ' ' + style.active : style.title}>
            {this.props.leftItem.name}
            {this.props.leftItem.place &&
            <IcoN size={24} name="arrowSense24"/>
            }
          </a>
          <div className={style.filler}/>
          <div className={style.rightItems}>
            {rightMenu.rightMenuIconDOMS}
          </div>
        </div>
        {this.state.titlePopup &&
        (
          <div className={style.invisible}>
            <ul className={style.titlePopup}>
              {this.renderLeftItems()}
            </ul>
          </div>
        )
        }
        {rightMenu.rightMenuItemsDOMS}
        {showOverlay &&
        <div className={style.overlay}/>
        }
      </div>
    );
  }
}

export {OptionsMenu}

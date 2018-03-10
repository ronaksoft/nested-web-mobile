/**
 * @auther robzizo < me@robzizo.ir >
 * Document By : robzizo
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Represents the options menu component.
 * Component gets the items from parent.
 */
import * as React from 'react';
import ILeftItem from './ILeftItem';
import IRightItem from './IRightItem';
import {IcoN} from 'components';
import {hashHistory} from 'react-router';

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

/**
 * OptionsMenu component is used for switch defferent view settings and filters whitin the different pages
 * @class OptionsMenu
 * @extends {React.Component<IOptionsMenuProps, IOptionsMenuState>}
 */
class OptionsMenu extends React.Component<IOptionsMenuProps, IOptionsMenuState> {
  private listener;
  /**
   * Constructor
   * Creates an instance of OptionsMenu.
   * can fill OptionsMenu state with initial value
   * @param {object} props
   * @memberof OptionsMenu
   */
  constructor(props: any) {
    super(props);

    /**
     * @type {object}
     * @property {boolean} titlePopup popover view stete
     * @property {boolean} iconIPopup popover view stete
     * @property {boolean} iconIIPopup popover view stete
     */
    this.state = {
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
    };
  }

  public componentDidMount() {
    this.listener = hashHistory.listen(() => {
      this.closeAll();
    });
  }

  public componentWillUnmount() {
    this.listener();
  }

  /**
   * opens the item popover and close other items popover
   * @param {string} item name
   * @memberof OptionsMenu
   */
  public openPopUp = (wrapper: string) => {
    // if (this.props.leftItem.menu.length === 0) {
    //   return;
    // }
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

  /**
   * Close popover of all items. and update the state
   * @memberof OptionsMenu
   */
  public closeAll = () => {
    let state;
    state = {
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
    };
    this.setState(state);
  }

  private renderLeftItems = () => this.props.leftItem.menu.map((menuItem, index) => (
      <li key={menuItem.name + index} className={menuItem.isChecked ? style.activeItem : null}
          onClick={menuItem.onClick}>
        {/* {menuItem.icon && ( */}
          <div>
            <IcoN size={16} name={menuItem.icon}/>
          </div>
        {/* )} */}
        <div>
          <span>{menuItem.name}</span>
          {menuItem.isChecked &&
          <IcoN size={16} name="heavyCheck16"/>
          }
        </div>
      </li>
    ),
  )

  private touchMove = (e: any) => {
    e = e || window.event;
    // e.returnValue = false;
    // e.cancelBubble = true;
    // if (e.preventDefault) {
    //     e.preventDefault();
    //     e.stopPropagation();
    // }
    // return false;
  }

  /**
   * Creats the right icon and popover elemnts
   * @private
   * @memberof OptionsMenu
   * @returns {ReactElement} markup
   */
  private renderRightMenus = () => {

    const rightMenuItemsDOMS = [];
    const rightMenuIconDOMS = [];

    this.props.rightItems.forEach((item) => {

      // state property of this item
      const typeStr = item.type + 'Popup';

      // popover menu items of this items
      const childrens = [];
      item.menu.forEach((menuItem) => {
        childrens.push(

          // genereate a unique key for each child
          <li key={menuItem.name.replace(' ', '') + item.type}
              onClick={menuItem.onClick}
              className={[menuItem.isChecked ? style.activeItem : null,
                menuItem.type === 'kind' ? style.kindItem : null].join(' ')}>

            {/* only iconII have icons in component and iconI shouldnt render the icons */}
            {item.type === 'iconII' &&
              <IcoN size={16} name={menuItem.icon.name}/>
            }
            <span>{menuItem.name}</span>
            {/* the current filter or sort should be viewable in scene */}
            {menuItem.isChecked &&
              <IcoN size={16} name="heavyCheck16"/>
            }
          </li>,
        );
      });

      // The Jsx markup popover of this item and its render condition
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

      // icon Jsx element of this item
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

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof OptionsMenu
   */
  public render() {

    // black overlay on top of the page content visibility condition
    const showOverlay = this.state.titlePopup || this.state.iconIPopup || this.state.iconIIPopup;

    // Get right menu items with show condition
    const rightMenu = this.renderRightMenus();
    return (
      <div className={style.container} onTouchMove={this.touchMove}>
        {/*  always visible area contains icons element */}
        <div className={style.visible}>
          <a onClick={this.openPopUp.bind(this, this.props.leftItem.type)}
             className={this.state.titlePopup ? style.title + ' ' + style.active : style.title}>
            {this.props.leftItem.name}
            {this.props.leftItem.menu.length > 0 &&
              <IcoN size={24} name="arrowSense24"/>
            }
          </a>
          <div className={style.filler}/>
          <div className={style.rightItems}>
            {rightMenu.rightMenuIconDOMS}
          </div>
        </div>
        {/*  left item popover with show condition */}
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
        {/*  black overlay element that fill all screen under the OptionsMenu elements */}
        {showOverlay &&
        <div onClick={this.closeAll.bind(this, '')} className={style.overlay}/>
        }
      </div>
    );
  }
}

export {OptionsMenu}

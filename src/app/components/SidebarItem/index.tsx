/**
 * @file component/SidebarItem/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the place list item for rendering in sidebar.
 *              Component gets the requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-23
 *              Reviewed by:            -
 *              Date of review:         -
 */

import * as React from 'react';
import ISidebarPlace from '../../api/place/interfaces/ISidebarPlace';
import {IcoN, PlaceItem, PlaceName} from 'components';
import {Link} from 'react-router';

const style = require('./sidebarItem.css');

interface ISidebarItemProps {
  place: ISidebarPlace;
  openChild: () => void;
  key: string;
  childrenUnread: boolean;
  unreads: number;
}

/**
 * @classdesc Renders the sidebar places Items and handles childrens view statement
 * @class SidebarItem
 * @extends {React.Component<ISidebarItemProps, any>}
 */
class SidebarItem extends React.Component<ISidebarItemProps, any> {

  /**
   * @constructor
   * Creates an instance of SidebarItem.
   * @param {ISidebarItemProps} props
   * @memberof SidebarItem
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * @function onItemClick
   * Notify parent this item is clicked
   * @private
   * @memberof SidebarItem
   * @param {object} e
   */
  private onItemClick = (e) => {
    this.props.openChild();
    e.preventDefault();
    return false;
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof SidebarItem
   * @lends SidebarItem
   */
  public render() {
    const placeIndent = [];
    /**
     * create blank elements to indent the place children position based
     * on user interface implicates
     */
    for (let i: number = 0; i < this.props.place.depth; i++) {
      placeIndent.push(
        <div key={this.props.place.id + i + 'b'} className={style.indent}/>,
      );
    }
    return (
      <li key={this.props.place.id + 'ss'}>
        {/* horizental rule for grand places */}
        {!this.props.place.isChildren &&
        <hr className={style.hrDark}/>
        }
        {!this.props.place.isChildren &&
        <hr className={style.hrLight}/>
        }
        <Link to={`#/m/places/${this.props.place.id}/messages`} activeClassName="active">
          <div className={style.place}>
            {/* margin left on each child depth */}
            {placeIndent}
            <PlaceItem place_id={this.props.place.id} size={24} borderRadius="3px"/>
            {/* devider */}
            <div className={style.indent}/>
            <PlaceName place_id={this.props.place.id}/>
            {/* unreads element */}
            {this.props.unreads > 0 &&
            <b>{this.props.unreads}</b>
            }
            {/* click on this element make the childrens appear/dissapear */}
            <div className={[style.childArrow, this.props.place.isOpen ? style.active : null].join(' ')}
                 onClick={this.onItemClick}>
              {this.props.place.hasChildren &&
              <IcoN size={16} name={'arrow16White'}/>
              }
              {this.props.childrenUnread &&
              <IcoN size={8} name={'circle8blue'}/>
              }
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

export {SidebarItem}

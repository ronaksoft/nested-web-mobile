/**
 * @file component/Chips/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the chips for view rendering of place names or email addresses.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import FileUtil from 'services/utils/file';
import {IPicture} from 'api/interfaces';

const style = require('./chips.css');
const unknownPicture = require('assets/icons/absents_place.svg');

interface IChipsItem {
  _id: string;
  name: string;
  picture?: IPicture;
}

interface IChipsProps {
  item?: IChipsItem;
  onChipsClick?: any;
  active: boolean;
}

interface IChipsState {
  active?: boolean;
}

/**
 * PlaceChips is a view item for displaying indivisual places in
 * compose or anyother components
 * @class PlaceChips
 * @extends {React.Component<IChipsProps, IChipsState>}
 */
class PlaceChips extends React.Component<IChipsProps, IChipsState> {

  /**
   * @constructor
   * Creates an instance of PlaceChips.
   * @param {object} props
   * @memberof PlaceChips
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {boolean} active - focus state for the chips.
     */
    this.state = {
      active : false,
    };
  }

  /**
   * update the state object when the parent whisp chips is selected
   * @param {IChipsProps} nextProps
   * @memberof PlaceChips
   */
  public componentWillReceiveProps(nextProps) {
    this.setState(
      {
        active : nextProps.active,
      },
    );
  }

  /**
   * handler for active focus state to chips and calls after clicking chips
   * @param {IChipsProps} nextProps
   * @memberof PlaceChips
   */
  private itemSelected() {
    this.props.onChipsClick(this.props.item);
  }

  /**
   * Gets place image source
   * @private
   * @param {IChipsItem} item
   * @returns {string} place picture url
   * @memberof PlaceChips
   */
  private getPicture(item: IChipsItem) {
    if (item && item.picture && item.picture.x64) {
      return FileUtil.getViewUrl(item.picture.x64);
    }

    return unknownPicture;
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof PlaceChips
   */
  public render() {
    return (
      <a key={this.props.item._id} onClick={this.itemSelected.bind(this, '')}
      className={this.state.active ? style.placechips + ' ' + style.selectedItem : style.placechips}>
        <img src={this.getPicture(this.props.item)} alt=""/>
        {this.props.item.name || this.props.item._id}
      </a>
    );
  }
}

export {PlaceChips, IChipsItem}

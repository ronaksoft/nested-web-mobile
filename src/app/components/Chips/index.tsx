import * as React from 'react';
import Store from 'services/utils/store';
import IPicture from 'api/interfaces/IPicture';

const style = require('./chips.css');
const unknownPicture = require('assets/icons/absents_place.svg');

interface IChipsItem {
  _id: string;
  name: string;
  picture: IPicture;
}

interface IChipsProps {
  item?: IChipsItem;
  onChipsClick?: any;
  active: boolean;
}

interface IChipsState {
  active?: boolean;
}

class PlaceChips extends React.Component<IChipsProps, IChipsState> {

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState(
      {
        active : false,
      },
    );
  }
  public componentWillReceiveProps(nextProps) {
    this.setState(
      {
        active : nextProps.active,
      },
    );
  }
  private itemSelected() {
    this.props.onChipsClick(this.props.item);
  }

  public render() {
    return (
      <a key={this.props.item._id} onClick={this.itemSelected.bind(this, '')}
      className={this.state.active ? style.placechips + ' ' + style.selectedItem : style.placechips}>
        <img src={this.props.item.picture.x64 ? Store.getViewUrl(this.props.item.picture.x64) : unknownPicture} alt=""/>
        {this.props.item.name}
      </a>
    );
  }
}

export {PlaceChips, IChipsItem}

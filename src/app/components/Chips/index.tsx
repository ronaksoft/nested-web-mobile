import * as React from 'react';
import FileUtil from 'services/utils/file';
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

  private getPicture(item: IChipsItem) {
    return item.picture.x64
            ? FileUtil.getViewUrl(item.picture.x64)
            : unknownPicture;
  }

  public render() {
    return (
      <a key={this.props.item._id} onClick={this.itemSelected.bind(this, '')}
      className={this.state.active ? style.placechips + ' ' + style.selectedItem : style.placechips}>
        <img src={this.getPicture(this.props.item)} alt=""/>
        {this.props.item.name}
      </a>
    );
  }
}

export {PlaceChips, IChipsItem}

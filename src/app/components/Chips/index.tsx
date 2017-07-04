import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import 'antd/dist/antd.css';

const style = require('./chips.css');

interface IChipsProps {
  item?: IPlace;
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
        <img src={this.props.item.picture.x32} alt=""/>
        {this.props.item.name}
      </a>
    );
  }
}

export {PlaceChips}

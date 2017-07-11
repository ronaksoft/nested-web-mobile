import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {placeAdd} from '../../redux/places/actions/index';
import PlaceApi from '../../api/place/index';
import {connect} from 'react-redux';

interface IOwnProps {
  plc_id: string;
}
interface IProps {
  plc_id: string;
  places: IPlace[];
  placeAdd: (place: IPlace) => {};
}

interface IState {
  plc: IPlace | null;
}

class PlaceName extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      plc: null,
    };
  }

  public componentDidMount() {
    const plc = this.props.places.filter((plc: IPlace) => {
      return plc._id === this.props.plc_id;
    });

    if (plc.length > 0) {
      this.setState({
        plc: plc[0],
      });
    } else {
      const placeApi = new PlaceApi();
      placeApi.get({place_id: this.props.plc_id})
        .then((place: IPlace) => {
          this.setState({
            plc: place,
          });
          this.props.placeAdd(place);
        });
    }
  }

  public render() {

    const {plc} = this.state;

    if (!plc) {
      return null;
    }
    return (
      <span>{plc.name}</span>
    );
  }
}
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  places: store.places.places,
  plc_id: ownProps.plc_id,
});

const mapDispatchAction = (dispatch) => {
  return {
    placeAdd: (place: IPlace) => dispatch(placeAdd(place)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(PlaceName);

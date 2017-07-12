import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {placeAdd} from '../../redux/places/actions/index';
import PlaceApi from '../../api/place/index';
import {connect} from 'react-redux';

interface IOwnProps {
  place_id: string;
}
interface IProps {
  place_id: string;
  places: IPlace[];
  placeAdd: (place: IPlace) => {};
}

interface IState {
  place: IPlace | null;
}

class PlaceName extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      place: null,
    };
  }

  public componentDidMount() {
    const place = this.props.places.filter((place: IPlace) => {
      return place._id === this.props.place_id;
    });

    if (place.length > 0) {
      this.setState({
        place: place[0],
      });
    } else {
      const placeApi = new PlaceApi();
      placeApi.get({place_id: this.props.place_id})
        .then((p: IPlace) => {
          this.setState({
            place: p,
          });
          this.props.placeAdd(p);
        });
    }
  }

  public render() {

    const {place} = this.state;

    if (!place) {
      return null;
    }
    return (
      <span>{place.name}</span>
    );
  }
}
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  places: store.places.places,
  place_id: ownProps.place_id,
});

const mapDispatchAction = (dispatch) => {
  return {
    placeAdd: (place: IPlace) => dispatch(placeAdd(place)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(PlaceName);

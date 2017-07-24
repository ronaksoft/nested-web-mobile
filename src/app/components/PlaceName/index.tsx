/**
 * @file component/PlaceName/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the Place name.
 * Document By : naamesteh
 * Date of documantion : 07/23/2017
 * Review by : -
 * Date of review : -
 */
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
/**
 * renders the PlaceName element
 * @class PlaceName
 * @extends {React.Component<IProps, IState>}
 */
class PlaceName extends React.Component<IProps, IState> {

  /**
   * Constructor
   * Creates an instance of PlaceName.
   * @param {IProps} props
   * @memberof PlaceName
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     * @property {boolean} active show condition for element
     */
    this.state = {
      place: null,
    };
  }

  /**
   *
   * @param placeId
   */
  private setPlace(placeId) {
    const place = this.props.places.filter((place: IPlace) => {
      return place._id === placeId;
    });

    if (place.length > 0) {
      this.setState({
        place: place[0],
      });
    } else {
      const placeApi = new PlaceApi();
      placeApi.get({place_id: placeId})
        .then((p: IPlace) => {
          this.setState({
            place: p,
          });
          this.props.placeAdd(p);
        });
    }
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setPlace(newProps.place_id);
  }

  public componentDidMount() {
    this.setPlace(this.props.place_id);
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

/**
 * @file component/PlaceItem/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the place Picture for view rendering of place picture.
 *              Component get requiered data directly from store or api call.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {IPlace} from 'api/interfaces';
import {placeAdd} from '../../redux/places/actions/index';
import PlaceApi from '../../api/place/index';
import {connect} from 'react-redux';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';

const style = require('./placeItem.css');

interface IOwnProps {
  place_id: string;
  borderRadius: string;
  size: any;
}

interface IProps {
  place_id: string;
  borderRadius: string;
  size: any;
  places: IPlace[];
  placeAdd: (place: IPlace) => {};
}

interface IState {
  place: IPlace | null;
}

/**
 * create place picture for render view.
 * parent give pass the place Id and component gets the
 * picture of place from Api call
 * @class PlaceItem
 * @extends {React.Component<IProps, IState>}
 */
class PlaceItem extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of PlaceItem.
   * @param {object} props
   * @memberof PlaceItem
   */
  constructor(props: any) {
    super(props);
    this.state = {
      place: null,
    };
  }

  /**
   * Try to Get place from redux store if its not stored before
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof PlaceItem
   * @override
   */
  public componentDidMount() {
    // search resdux store for any place have the same same id with props id
    const place = this.props.places.filter((place: IPlace) => {
      return place._id === this.props.place_id;
    });

    // determine place is stored in redux already
    if (place.length > 0) {
      this.setState({
        place: place[0],
      });
    } else {
      // Define the place Api
      const placeApi = new PlaceApi();
      // call place Api for get place obj of the passed place Id
      placeApi.get(this.props.place_id)
        .then((p: IPlace) => {
          this.setState({
            place: p,
          });
          // store place in redux store
          this.props.placeAdd(p);
        });
    }
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof PlaceItem
   * @override
   * @generator
   */
  public render() {
    /**
     * @name place
     * @const
     * @type {object}
     */
    const {place} = this.state;

    if (!place) {
      return null;
    }

    /**
     * define borderRadius and size
     */
    const {
      borderRadius,
      size,
    } = this.props;

    /**
     * appropriate key for picture object
     * @name picDim
     * @const
     * @type {string}
     */
    const picDim = size > 32 ? 'x64' : 'x32';

    /**
     * css size value
     * @name sizePX
     * @const
     * @type {string}
     */
    const sizePX = size.toString(10) + 'px';

    /**
     * css style for image
     * @name imageStyle
     * @const
     * @type {object}
     */
    const imageStyle = {
      display: 'flex',
      borderRadius,
      margin: '0!important',
      width: sizePX,
      height: sizePX,
      flex: 'none',
    };

    /**
     * generates the place image source
     * @name img
     * @var
     * @type {jsxElement}
     */
    let img;
    if (place.picture.x32.length > 0) {
      img = (
        <img className={style.picture} width={sizePX} height={sizePX}
             src={`${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${place.picture[picDim]}`}/>
      );
    } else {
      img = (
        <img className={style.picture} width={sizePX} height={sizePX}
          src={`/public/assets/icons/absents_place.svg`}/>
      );
    }

    return (
      <div style={imageStyle}>
        {img}
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  places: store.places.places,
  place_id: ownProps.place_id,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchAction = (dispatch) => {
  return {
    placeAdd: (place: IPlace) => dispatch(placeAdd(place)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(PlaceItem);

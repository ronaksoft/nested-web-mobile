import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {placeAdd} from '../../redux/places/actions/index';
import PlaceApi from '../../api/place/index';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import {IcoN} from 'components';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';

const style = require('./placeItem.css');
const settings = {
  textColor: '#ffffff',
  height: 24,
  width: 24,
  fontSize: 11,
  fontWeight: 400,
  fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
  radius: 0,
};

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

class PlaceItem extends React.Component<IProps, IState> {
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
    const {
      borderRadius,
      size,
    } = this.props;
    const {place} = this.state;
    const sizePX = size.toString(10) + 'px';

    // const ImageHolder = {
    //   width: sizePX,
    //   height: sizePX,
    //   display: 'flex',
    //   flex: 'none',
    //   borderRadius,
    // //   position: 'relative',
    // //   justifyContent: 'center',
    // };

    const innerStyle = {
      lineHeight: sizePX,
      display: 'flex',
      borderRadius,
    };

    const imageStyle = {
      display: 'flex',
      borderRadius,
      margin: '0!important',
      width: sizePX,
      height: sizePX,
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }
    let img;
    if (place.picture.x32.length > 0) {
      img = (
          <img className={style.picture}
          src={`${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${place.picture}`}/>
      );
    } else {
      img = (
          <IcoN size={24} name={'absentPlace24'}/>
      );
    }

    return (
      <Row className="place-row" type="flex" align="middle">
        <Col span={3}>
            <div className="PlaveView" style={style}>
                <div className="PlaceView--inner" style={innerStyle}>
                  {img}
                </div>
            </div>
        </Col>
    </Row>
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

export default connect(mapStateToProps, mapDispatchAction)(PlaceItem);

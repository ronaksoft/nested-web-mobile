import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {Row, Col} from 'antd';

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

interface IPlaceItemProps {
  item?: IPlace;
  borderRadius: string;
  size: any;
  avatar: boolean;
  name: boolean;
  id: boolean;
}

class PlaceItem extends React.Component<IPlaceItemProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    const {
      borderRadius,
      size,
      item,
      avatar,
      name,
      id,
    } = this.props;
    const sizePX = size.toString(10) + 'px';

    const ImageHolder = {
      width: sizePX,
      height: sizePX,
      display: 'flex',
      flex: 'none',
      borderRadius,
    //   position: 'relative',
    //   justifyContent: 'center',
    };

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

    let imgDOM;
    let nameDOM;
    let idDOM;
    const classes = ['PlaveView'];
    const placeName = `${item.name}`;

    if (avatar) {
        const src = item.picture.x32 ? item.picture.x32 : './../../../style/images/absents_place.svg';
        imgDOM = <img className="PlaceView--img" style={imageStyle} src={src}/>;
    }

    if ( name ) {
      nameDOM = <span className={style.textStyle}>{placeName}</span>;
    }

    if ( id ) {
      idDOM = <span className={style.textIdStyle}>{`${item._id}`}</span>;
    }
    return (
      <Row className="place-row" type="flex" align="middle">
        <Col span={3}>
            <div aria-label={placeName} className={classes.join(' ')} style={style}>
                <div className="PlaceView--inner" style={innerStyle}>
                {avatar && (
                    <div style={ImageHolder}>
                        {imgDOM}
                    </div>
                )}
                <div className="PlaveView-detail">
                    {name && nameDOM}
                    {id && idDOM}
                </div>
                </div>
            </div>
        </Col>
    </Row>
    );
  }
}

export {PlaceItem}

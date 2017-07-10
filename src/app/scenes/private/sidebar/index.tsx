import * as React from 'react';
import {sortBy} from 'lodash';
import PlaceApi from '../../../api/place/index';
// import IPlaceListResponse from '../../../api/place/interfaces/IPlaceListResponse';
import IPlaceConjuction from './IPlaceConjuction';
import IPlace from '../../../api/place/interfaces/IPlace';
const style = require('./sidebar.css');
import {IcoN} from 'components';
// import {browserHistory} from 'react-router';

interface ISidebarProps {
  closeSidebar: () => void;
}

interface ISidebarState {
  places?: IPlace[];
  placesConjuction?: any;
}

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  private PlaceApi: PlaceApi;
  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      places: [],
    });
  }

  public componentDidMount() {
    this.PlaceApi = new PlaceApi();
    this.getPlaces();
  }

  private getPlaces() {
    console.log('getPlaces');
    const params = {
      with_children: true,
    };

    this.PlaceApi.getAllPlaces(params)
      .then((response: IPlace[]) => {
        console.log(response);
        const places = sortBy(response, [(o) =>  o._id]);
        let placesConjuctions: IPlaceConjuction[];
        places.array.forEach((element, i) => {
          console.log(element, i);
          let placesConjuction: IPlaceConjuction;
          placesConjuction.id = element._id;
          placesConjuction.isOpen = false;
          placesConjuction.depth = 0;
          console.log(placesConjuction.id.split('.'));
          placesConjuctions.push(placesConjuction);
        });
      });
  }

  public toggleChildren(place: any) {
    // const places: IPlace[];
    // places = this.state.places;
    console.log(place);
    // places[place].isOpen = !places[place].isOpen;
    // this.setState({
    //   places: places,
    // });
  }

  public render() {
    const src = 'https://xerxes.nested.me/view/5961b14f43b15f00017a4e29/' +
    'THU58B56C37E5F16400019C525158B56C37E5F16400019C5252';
    const placeId = 'placeId';
    return (
      <div className={style.sidebar}>
        <div className={style.sidebarHead} onClick={this.props.closeSidebar}>
          <IcoN size={24} name={'xcross24White'}/>
        </div>
        <ul className={style.sidebarActions}>
          <li>
            <IcoN size={16} name={'bookmarkMessage1White'}/>
            Feed
          </li>
          <li>
            <IcoN size={16} name={'bookmarkMessage16White'}/>
            Bookmarked Posts
          </li>
          <li>
            <IcoN size={16} name={'sentMessage16White'}/>
            Shared by me
          </li>
        </ul>
        <hr className={style.hrDark}/>
        <hr className={style.hrLight}/>
        <ul className={style.places}>
          <li>
            <div className={style.place}>
              <img src={src}/>
              <span>Salisu Dutse</span>
              <b>13</b>
              <div className={style.childArrow + this.state[placeId] ? style.active : null}
              onClick={this.toggleChildren.bind(this, 'placeId')}>
                <IcoN size={16} name={'arrow16White'}/>
              </div>
            </div>
            <hr className={style.hrDark}/>
            <hr className={style.hrLight}/>
          </li>
        </ul>
        <ul className={style.invitations}>
          <li>
            <div className={style.place}>
              image name
            </div>
            <hr className={style.hrDark}/>
            <hr className={style.hrLight}/>
          </li>
        </ul>
        <ul className={style.sidebarActions}>
          <li>
            <IcoN size={16} name={'gear16White'}/>
            Profile and Settings
          </li>
          <li>
            <IcoN size={16} name={'ask16White'}/>
            Help Center
          </li>
          <li>
            <IcoN size={16} name={'exit16White'}/>
            Sign out
          </li>
        </ul>
      </div>
    );
  }
}

export {Sidebar}

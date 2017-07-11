import * as React from 'react';
import {sortBy} from 'lodash';
import PlaceApi from '../../../api/place/index';
// import IPlaceListResponse from '../../../api/place/interfaces/IPlaceListResponse';
import IPlaceConjuction from './IPlaceConjuction';
// import IPlace from '../../../api/place/interfaces/IPlace';
const style = require('./sidebar.css');
import {IcoN} from 'components';
// import {browserHistory} from 'react-router';

interface ISidebarProps {
  closeSidebar: () => void;
}

interface ISidebarState {
  places?: IPlaceConjuction[];
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
    this.PlaceApi = new PlaceApi();
    this.getPlaces();
  }

  // public componentDidMount() {

  // }

  private getPlaces() {
    const params = {
      with_children: true,
    };

    this.PlaceApi.getAllPlaces(params)
      .then((response: any) => {
        const places = sortBy(response.data.places, [(o) =>  o._id]);
        // console.log(places);
        const placesConjuctions = [];
        places.forEach((element, i) => {
          // console.log(element, i);
          const idSplit = element._id.split('.');
          const placesConjuction: IPlaceConjuction = {
            id : element._id,
            name : element.name,
            picture : element.picture,
            depth : idSplit.length - 1,
            childrenUnseen : false,
            expanded : false,
            hasChildren : false,
            isChildren : false,
            unreadPosts : element.unread_posts,
          };
          if (idSplit.length > 1) {
            placesConjuction.isChildren = true;
            const prevSplit = placesConjuctions[i - 1].id.split('.');
            let evaluateDepth = 0;
            let actualDepth = 0;
            let anyUnMatch: boolean = false;

            evaluateDepth = prevSplit.length < idSplit.length ? prevSplit.length : idSplit.length - 1;
            for (let d: number = 0; d < evaluateDepth; d++) {
              if ( prevSplit[d] === idSplit[d]) {
                if (!anyUnMatch) {
                  actualDepth++;
                }
              } else {
                anyUnMatch = true;
              }
            }
            placesConjuction.depth = actualDepth;
          }
          if (placesConjuction.depth > 0 && placesConjuctions[i - 1].depth + 1 === placesConjuction.depth ) {
            placesConjuctions[i - 1].hasChildren = true;
          }
          if ( placesConjuction.unreadPosts > 0 ) {
            for (let j: number = 1; j <= placesConjuction.depth; j++) {
              const newIdSplit = idSplit.slice(0);
              const parentID = newIdSplit.splice(0, j).join('.');
              const parentElement = placesConjuctions.find(
                (item) => item.id === parentID,
              );
              parentElement.childrenUnseen = true;
            }
          }
          placesConjuctions.push(placesConjuction);
        });
        this.setState({
          places: placesConjuctions,
        });
        // console.log(placesConjuctions);
      });
  }

  public toggleChildren(placeId: string, depth: number) {
    // const places: IPlace[];
    // places = this.state.places;
    // console.log(placeId);
    // places[place].isOpen = !places[place].isOpen;
    // this.setState({
    //   places: places,
    // });
    const placesMirror = this.state.places.slice(0);
    const filter = placesMirror.filter(
      (p) => {
        // console.log(arguments, i);
        const childrenParent = p.id.split('.').slice(0).splice(0, depth + 1).join('.');
        // console.log(childrenParent);
        return placeId === childrenParent &&
        p.depth === depth + 1;
      },
    );
    filter.forEach((item) => {
      item.expanded = !item.expanded;
    });
    this.setState({
      places: placesMirror,
    });
  }

  public render() {
    const src = 'https://xerxes.nested.me/view/5961b14f43b15f00017a4e29/' +
    'THU58B56C37E5F16400019C525158B56C37E5F16400019C5252';
    const placeDoms = [];
    this.state.places.forEach((place, i) => {
      const showCase = !place.isChildren || place.expanded;
      if ( showCase ) {
        const placeIndent = [];
        for (let i: number = 0; i < place.depth; i++) {
          placeIndent.push(
            <div key={place.id + i} className={style.indent}/>,
          );
        }
        const placeDom = (
          <li key={place.id + i}>
            <div className={style.place}>
              {placeIndent}
              <img src={src}/>
              <span>{place.name}</span>
              {place.unreadPosts > 0 &&
                <b>{place.unreadPosts}</b>
              }
              {place.hasChildren &&
                <div className={style.childArrow + place.expanded ? style.active : null}
                onClick={this.toggleChildren.bind(this, place.id, place.depth)}>
                  <IcoN size={16} name={'arrow16White'}/>
                </div>
              }
            </div>
            {!place.isChildren &&
              <hr className={style.hrDark}/>
            }
            {!place.isChildren &&
              <hr className={style.hrLight}/>
            }
          </li>
        );
        placeDoms.push(placeDom);
      }
    });
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
          {placeDoms}
          {/*<li>
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
          </li>*/}
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

import * as React from 'react';
import {sortBy} from 'lodash';
import PlaceApi from '../../../api/place/index';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import ISidebarPlace from '../../../api/place/interfaces/ISidebarPlace';
import IPlace from '../../../api/place/interfaces/IPlace';
import IUnreadPlace from '../../../api/place/interfaces/IUnreadPlace';
import {SidebarItem, InvitationItem, IcoN} from 'components';
import {setSidebarPlaces, setUserPlaces, setUnreadPlaces} from '../../../redux/app/actions/';
import {placeAdd} from '../../../redux/places/actions/';

import IGetUnreadsRequest from '../../../api/place/interfaces/IGetUnreadsRequest';
const style = require('./sidebar.css');

// import {browserHistory} from 'react-router';

interface IOwnProps {
  closeSidebar: () => void;
}

interface ISidebarProps {
  closeSidebar: () => void;
  placeAdd: (place: IPlace) => void;
  setSidebarPlaces: (sidebarPlaces: ISidebarPlace[]) => void;
  setUnreadPlaces: (unreadPlaces: IUnreadPlace) => void;
  setUserPlaces: (placeIds: string[]) => void;
  sidebarPlaces: ISidebarPlace[];
  sidebarPlacesUnreads: IUnreadPlace;
  places: IPlace[];
  userPlaces: string[];
}

interface ISidebarState {
  places?: ISidebarPlace[];
  placesConjuction?: any;
  invitations?: IPlace[];
  sidebarPlacesUnreads?: IUnreadPlace;
}

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  private PlaceApi: PlaceApi;

  constructor(props: any) {
    super(props);
    this.state = {
      places : [],
    };
  }

  public componentWillMount() {
    this.setState({
      places: [],
      invitations: [],
      sidebarPlacesUnreads: {
        placesUnreadCounts: {},
        placesUnreadChildrens: {},
      },
    });
    this.PlaceApi = new PlaceApi();
    this.getMyPlaces();
    this.getInvitations();
  }

  // public componentDidMount() {

  // }

  private getInvitations() {
    this.PlaceApi.getInvitations()
      .then((response: any) => {
        this.setState({
          invitations: response.invitations,
        });
      });
  }

  private getUnreads() {
    if (this.props.sidebarPlacesUnreads &&
    this.props.sidebarPlacesUnreads.placesUnreadCounts &&
    this.props.sidebarPlacesUnreads.placesUnreadChildrens) {
      this.setState({
        sidebarPlacesUnreads: this.props.sidebarPlacesUnreads,
      });
    } else {
      const sidebarPlaces: string[] = [];
      this.state.places.slice(0).forEach( (place) => {
        sidebarPlaces.push(place.id);
      });
      const params: IGetUnreadsRequest = {
        place_id: sidebarPlaces.join(','),
        subs: false,
      };
      this.PlaceApi.getUnreads(params)
        .then( (items) => {
          const unreadCounts = {};
          const unreadChildrens = {};
          items.forEach((element) => {
            const pid: string = element.place_id;
            unreadCounts[pid] = element.count;
            unreadChildrens[pid] = false;
            const sidebarPlaceItem = this.state.places.find( (o) => o.id === pid);
            if ( element.count > 0 ) {
              for (let j: number = 1; j <= sidebarPlaceItem.depth; j++) {
                const parentID = pid.split('.').splice(0, j).join('.');
                const parentElement = this.state.places.find(
                  (item) => item.id === parentID,
                );
                if ( parentElement ) {
                  unreadChildrens[parentID] = true;
                }
              }
            }
          });
          this.props.setUnreadPlaces({
            placesUnreadCounts : unreadCounts,
            placesUnreadChildrens : unreadChildrens,
          });
          this.setState({
            sidebarPlacesUnreads : {
              placesUnreadCounts : unreadCounts,
              placesUnreadChildrens : unreadChildrens,
            },
          });
        });
    }
  }

  private getMyPlaces() {
    const params = {
      with_children: true,
    };
    if (this.props.sidebarPlaces.length > 0) {
      console.log(this.props.sidebarPlaces);
      this.setState({
        places: JSON.parse(JSON.stringify(this.props.sidebarPlaces)),
      }, () => {
        this.getUnreads();
      });
      console.log(this.state);
      this.getUnreads();
    } else {
      this.PlaceApi.getAllPlaces(params)
        .then((response: IPlace) => {
          console.time('a');
          const places = sortBy(response, [(o) => o._id]);
          const placesConjuctions: ISidebarPlace[] = [];
          places.forEach((element, i) => {
            this.props.placeAdd(element);
            const idSplit = element._id.split('.');
            const placesConjuction: ISidebarPlace = {
              id: element._id,
              depth: idSplit.length - 1,
              expanded: false,
              isOpen: false,
              hasChildren: false,
              isChildren: false,
            };
            if (idSplit.length > 1) {
              placesConjuction.isChildren = true;
              const prevSplit = placesConjuctions[i - 1].id.split('.');
              let evaluateDepth = 0;
              let actualDepth = 0;
              let anyUnMatch: boolean = false;

              evaluateDepth = prevSplit.length < idSplit.length ? prevSplit.length : idSplit.length - 1;
              for (let d: number = 0; d < evaluateDepth; d++) {
                if (prevSplit[d] === idSplit[d]) {
                  if (!anyUnMatch) {
                    actualDepth++;
                  }
                } else {
                  anyUnMatch = true;
                }
              }
              placesConjuction.depth = actualDepth;
            }
            if (placesConjuction.depth > 0) {
              const prv = placesConjuctions[i - 1].id.split('.');
              const newVar = idSplit.slice(0);
              const compareArray = newVar.splice(0, prv.length);
              if ( prv.join('.') === compareArray.join('.') ) {
                placesConjuctions[i - 1].hasChildren = true;
              }
            }
            placesConjuctions.push(placesConjuction);
          });
          console.timeEnd('a');
          this.setState({
            places: placesConjuctions,
          });
          this.getUnreads();
          this.props.setSidebarPlaces(placesConjuctions);
        });
    }
  }

  public toggleChildren(placeId: string, depth: number) {
    const placesMirror = this.state.places.slice(0);
    const theParentItem = placesMirror.find((item) => {
      return item.id === placeId;
    });
    theParentItem.isOpen = !theParentItem.isOpen;
    const filter = placesMirror.filter(
      (p) => {
        const childrenParent = p.id.split('.').slice(0).splice(0, depth + 1).join('.');
        // if statement for hide childrens tale
        if (p.expanded) {
          return placeId === childrenParent &&
            p.depth >= depth + 1;
        } else {
          return placeId === childrenParent &&
            p.depth === depth + 1;
        }
      },
    );
    filter.forEach((item) => {
      // Retivice arrow rotation
      item.isOpen = false;
      item.expanded = !item.expanded;
    });
    this.setState({
      places: placesMirror,
    });
    return false;
  }

  public render() {
    const placeDoms = [];
    const invDoms = [];
    this.state.invitations.forEach((item, i) => {
      const invDom = (
        <InvitationItem key={i + 'nc'} item={item}/>
      );
      invDoms.push(invDom);
    });

    this.state.places.forEach((place, i) => {
      const showCase = !place.isChildren || place.expanded;
      if (showCase) {
        const placeDom = (
          <SidebarItem key={place.id + i + 'a'} place={place}
          unreads={this.state.sidebarPlacesUnreads.placesUnreadCounts[place.id]}
          childrenUnread={this.state.sidebarPlacesUnreads.placesUnreadChildrens[place.id]}
                       openChild={this.toggleChildren.bind(this, place.id, place.depth)}/>
        );
        placeDoms.push(placeDom);
      }
    });
    return (
      <div className={style.sidebar}>
        <div>
          <div className={style.sidebarHead} onClick={this.props.closeSidebar}>
            <IcoN size={24} name={'xcross24White'}/>
          </div>
          <ul className={style.sidebarActions}>
            <li>
              <Link to={`/feed`}>
                <IcoN size={16} name={'bookmarkMessage1White'}/>
                Feed
              </Link>
            </li>
            <li>
              <Link to={`/bookmark`}>
                <IcoN size={16} name={'bookmarkMessage16White'}/>
                Bookmarked Posts
              </Link>
            </li>
            <li>
              <Link to={`/shared`}>
                <IcoN size={16} name={'sentMessage16White'}/>
                Shared by me
              </Link>
            </li>
          </ul>
          <ul className={style.places}>
            {placeDoms}
          </ul>
          <hr className={style.hrDark}/>
          <hr className={style.hrLight}/>
          <ul className={style.invitations}>
            {invDoms}
          </ul>
          <ul className={style.sidebarActions}>
            {/*<li>
              <IcoN size={16} name={'gear16White'}/>
              Profile and Settings
            </li>*/}
            <li>
              <a href={`http://help.nested.me`} target="_blank">
                <IcoN size={16} name={'ask16White'}/>
                Help Center
              </a>
            </li>
            <li>
              <Link to={`/signout`}>
                <IcoN size={16} name={'exit16White'}/>
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store, ownPlops: IOwnProps) => {
  return {
    places: store.places.places,
    userPlaces: store.app.userPlaces,
    sidebarPlaces: store.app.sidebarPlaces,
    sidebarPlacesUnreads: store.app.sidebarPlacesUnreads,
    closeSidebar: ownPlops.closeSidebar,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    placeAdd: (place: IPlace) => (dispatch(placeAdd(place))),
    setSidebarPlaces: (sidebarPlace: ISidebarPlace[]) => (dispatch(setSidebarPlaces(sidebarPlace))),
    setUserPlaces: (placeIds: string[]) => (dispatch(setUserPlaces(placeIds))),
    setUnreadPlaces: (unreadPlaces: any) => (dispatch(setUnreadPlaces(unreadPlaces))),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

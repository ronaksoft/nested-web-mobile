import * as React from 'react';
import {sortBy} from 'lodash';
import PlaceApi from '../../../api/place/index';
import {connect} from 'react-redux';

import ISidebarPlace from '../../../api/place/interfaces/ISidebarPlace';
import IPlace from '../../../api/place/interfaces/IPlace';
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
  setUnreadPlaces: (sidebarPlacesUnreads: any) => void;
  setUserPlaces: (placeIds: string[]) => void;
  sidebarPlaces: ISidebarPlace[];
  sidebarUnreadPlaces: any;
  places: IPlace[];
  userPlaces: string[];
}

interface ISidebarState {
  places?: ISidebarPlace[];
  placesConjuction?: any;
  invitations?: IPlace[];
  sidebarUnreadPlaces?: any;
}

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  private PlaceApi: PlaceApi;

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      places: [],
      invitations: [],
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
        console.log(response.invitations);
        this.setState({
          invitations: response.invitations,
        });
      });
  }

  private getUnreads() {
    if (this.props.sidebarUnreadPlaces.length > 0) {
      this.setState({
        sidebarUnreadPlaces: this.props.sidebarUnreadPlaces,
      });
    } else {
      const sidebarPlaces: string[] = [];
      this.state.places.forEach( (place) => {
        sidebarPlaces.push(place.id);
      })
      let params: IGetUnreadsRequest;
      params.place_id = sidebarPlaces.join(',');
      params.subs = false;
      this.PlaceApi.getUnreads(params)
        .then( (items) => {
          console.log(items);
        });
      // if ( place.unreadPosts > 0 ) {
      //     for (let j: number = 1; j <= placesConjuction.depth; j++) {
      //       const newIdSplit = idSplit.slice(0);
      //       const parentID = newIdSplit.splice(0, j).join('.');
      //       const parentElement = placesConjuctions.find(
      //         (item) => item.id === parentID,
      //       );
      //       parentElement.childrenUnseen = true;
      //     }
      //   }
    }
  }

  private getMyPlaces() {
    const params = {
      with_children: true,
    };
    if (this.props.sidebarPlaces.length > 0) {
      this.setState({
        places: this.props.sidebarPlaces,
      });
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
            // FIXME
            // placesConjuctions[i - 1].id.split('.')
            if (placesConjuction.depth > 0) {
              const prv = placesConjuctions[i - 1].id.split('.');
              const newVar = idSplit.slice(0);
              const compareArray = newVar.splice(0, prv.length);
              // console.log('aaaaaaaaaa', prv, compareArray, idSplit, prv.join('.') === compareArray.join('.'));
              if ( prv.join('.') === compareArray.join('.') ) {
                placesConjuctions[i - 1].hasChildren = true;
              }
            }
            // if ( placesConjuction.unreadPosts > 0 ) {
            //   for (let j: number = 1; j <= placesConjuction.depth; j++) {
            //     const newIdSplit = idSplit.slice(0);
            //     const parentID = newIdSplit.splice(0, j).join('.');
            //     const parentElement = placesConjuctions.find(
            //       (item) => item.id === parentID,
            //     );
            //     parentElement.childrenUnseen = true;
            //   }
            // }
            placesConjuctions.push(placesConjuction);
          });
          this.getUnreads();
          console.timeEnd('a');
          this.setState({
            places: placesConjuctions,
          });
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
          <ul className={style.places}>
            {placeDoms}
          </ul>
          <hr className={style.hrDark}/>
          <hr className={style.hrLight}/>
          <ul className={style.invitations}>
            {invDoms}
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
      </div>
    );
  }
}

const mapStateToProps = (store, ownPlops: IOwnProps) => ({
  places: store.places.places,
  userPlaces: store.app.userPlaces,
  sidebarPlaces: store.app.sidebarPlaces,
  closeSidebar: ownPlops.closeSidebar,
});

const mapDispatchToProps = (dispatch) => {
  return {
    placeAdd: (place: IPlace) => (dispatch(placeAdd(place))),
    setSidebarPlaces: (sidebarPlace: ISidebarPlace[]) => (dispatch(setSidebarPlaces(sidebarPlace))),
    setUserPlaces: (placeIds: string[]) => (dispatch(setUserPlaces(placeIds))),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

import * as React from 'react';
import {sortBy} from 'lodash';
import PlaceApi from '../../../api/place/index';

// import IPlaceListResponse from '../../../api/place/interfaces/IPlaceListResponse';
import IPlaceConjuction from './IPlaceConjuction';
import IPlace from '../../../api/place/interfaces/IPlace';
const style = require('./sidebar.css');
import {IcoN, SidebarItem, InvitationItem} from 'components';
// import {browserHistory} from 'react-router';

interface ISidebarProps {
  closeSidebar: () => void;
}

interface ISidebarState {
  places?: IPlaceConjuction[];
  placesConjuction?: any;
  invitations?: IPlace[];
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

  private getPlaces() {
    const params = {
      with_children: true,
    };

    this.PlaceApi.getAllPlaces(params)
      .then((response: any) => {
        // console.time('a');
        const places = sortBy(response.data.places, [(o) =>  o._id]);
        const placesConjuctions = [];
        places.forEach((element, i) => {
          // console.log(element, i);
          const idSplit = element._id.split('.');
          const placesConjuction: IPlaceConjuction = {
            id : element._id,
            name : element.name,
            picture : element.picture.x32,
            depth : idSplit.length - 1,
            childrenUnseen : false,
            expanded : false,
            isOpen : false,
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
        // console.timeEnd('a');
        this.setState({
          places: placesConjuctions,
        });
      });
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
    this.state.places.forEach((place, i) => {
      if (i < 4) {
        const invDom = (
          <InvitationItem key={i + place.id + 'c'} place={place}/>
        );
        invDoms.push(invDom);
      }
      const showCase = !place.isChildren || place.expanded;
      if ( showCase ) {
        const placeDom = (
          <SidebarItem key={place.id + i + 'a'} place={place}
          openChild={this.toggleChildren.bind(this, place.id, place.depth)}/>
          // <li key={place.id + i}>
          //   {!place.isChildren &&
          //     <hr className={style.hrDark}/>
          //   }
          //   {!place.isChildren &&
          //     <hr className={style.hrLight}/>
          //   }
          //   <div className={style.place}>
          //     {placeIndent}
          //     <img src={src}/>
          //     <span>{place.name}</span>
          //     {place.unreadPosts > 0 &&
          //       <b>{place.unreadPosts}</b>
          //     }
          //     {place.hasChildren &&
          //       (
          //         <div className={[style.childArrow, place.isOpen ? style.active : null].join(' ')}
          //         onClick={this.toggleChildren.bind(this, place.id, place.depth)}>
          //           <IcoN size={16} name={'arrow16White'}/>
          //         </div>
          //       )
          //     }
          //   </div>
          // </li>
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
    );
  }
}

export {Sidebar}

/**
 * @file component/sidebar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Sidebar accessibility is like hamburguer menu from navbar component. and acts like
 *              a navigator. Component gets required data from redux Store or server Api
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {setSidebarPlaces, setUnreadPlaces} from '../../../redux/app/actions/';
import {placeAdd} from '../../../redux/places/actions/';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {sortBy} from 'lodash';
import {SidebarItem, InvitationItem, IcoN} from 'components';

import PlaceApi from '../../../api/place/index';
import IGetUnreadsRequest from '../../../api/place/interfaces/IGetUnreadsRequest';
import ISidebarPlace from '../../../api/place/interfaces/ISidebarPlace';
import IPlace from '../../../api/place/interfaces/IPlace';
import IUnreadPlace from '../../../api/place/interfaces/IUnreadPlace';

const style = require('./sidebar.css');

// import {browserHistory} from 'react-router';

interface IOwnProps {
  closeSidebar: () => void;
}

/**
 * @name ISidebarProps
 * @interface ISidebarProps for sidebar initials data
 * This interface pass the required parameters for sidebar.
 * @type {object}
 * @property {function} closeSidebar - Notifies parent to closing sidebar event
 * @property {function} placeAdd - Adds Place to redux store
 * @property {function} setSidebarPlaces - save All sidebar Places into redux store
 * @property {function} setUnreadPlaces - save All sidebar Places Unread counts
 * @property {Array<ISidebarPlace>} sidebarPlaces - All sidebar Places array
 * @property {IUnreadPlace} sidebarPlacesUnreads - sidebar places and unread Posts @link{}
 * @property {Array<IPlace>} places - Places Stored in redux store
 */
interface ISidebarProps {
  closeSidebar: () => void;
  placeAdd: (place: IPlace) => void;
  setSidebarPlaces: (sidebarPlaces: ISidebarPlace[]) => void;
  setUnreadPlaces: (unreadPlaces: IUnreadPlace) => void;
  sidebarPlaces: ISidebarPlace[];
  sidebarPlacesUnreads: IUnreadPlace;
  places: IPlace[];
}

/**
 * @name ISidebarState
 * @interface ISidebarState for sidebar reactive Elements
 * @type {object}
 * @property {Array<ISidebarPlace>} places
 * @property {object} placesConjuction have enough datas for sidebar view elements like : Place Children Position
 * @property {Array<IPlace>}invitations  Array of inivted Places
 * @property {IUnreadPlace} sidebarPlacesUnreads Sidebar Places unread counts @link{}
 */
interface ISidebarState {
  places?: ISidebarPlace[];
  placesConjuction?: any; // TODO Define interface
  invitations?: IPlace[];
  sidebarPlacesUnreads?: IUnreadPlace;
}

/**
 * @class Sidebar
 * @classdesc Component navigating user to Places Posts, feed, Bookmark, Shared messages
 * and other exernal links
 * @extends {React.Component<ISidebarProps, ISidebarState>}
 * @requires [<IcoN>,<sortBy>,<PlaceApi>,<SidebarItem>,<InvitationItem>]
 */
class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  /**
   * Define PlaceApi
   * @private
   * @type {PlaceApi}
   * @memberof Sidebar
   */
  private PlaceApi: PlaceApi;

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {ISidebarProps} props
   * @memberof Sidebar
   */
  constructor(props: any) {
    super(props);

    /**
     * @default this.state
     * @type {ISidebarState}
     */
    this.state = {
      places: [],
      invitations: [],
      sidebarPlacesUnreads: {
        placesUnreadCounts: {},
        placesUnreadChildrens: {},
      },
    };
  }

  /**
   * After mounting component, it starts exploring data
   * @override
   * @function componentDidMount
   * @memberof Sidebar
   */
  public componentDidMount() {

    /** Assign PlaceApi */
    this.PlaceApi = new PlaceApi();

    /** Get Sidebar Places */
    this.getMyPlaces();

    /** Get user Places invitations */
    this.getInvitations();
  }

  /**
   * send request to the server for invited places by calling PlaceApi
   * and sets response to the component state
   * @function getInvitations
   * @private
   * @memberof Sidebar
   */
  private getInvitations() {
    this.PlaceApi.getInvitations()
      .then((response: any) => {
        this.setState({
          invitations: response.invitations,
        });
      });
  }

  /**
   * Get unread counts of each place and add additional boolean property for children Places Unread state
   *
   * @function getUnreads
   * @private
   * @memberof Sidebar
   */
  private getUnreads() {

    /**
     * Detemines if recieved data is exists assigns to 'sidebarPlacesUnreads'
     */
    if (this.props.sidebarPlacesUnreads &&
      this.props.sidebarPlacesUnreads.placesUnreadCounts &&
      this.props.sidebarPlacesUnreads.placesUnreadChildrens) {
      return this.setState({
        sidebarPlacesUnreads: this.props.sidebarPlacesUnreads,
      });
    } else {
      const sidebarPlaces: string[] = [];
      this.state.places.slice(0).forEach((place) => {
        sidebarPlaces.push(place.id);
      });

      /**
       * prepares the Request object for Place unreads request
       * @const
       * @type {IGetUnreadsRequest}
       */
      const params: IGetUnreadsRequest = {
        place_id: sidebarPlaces.join(','),
        subs: false,
      };
      this.PlaceApi.getUnreads(params)
        .then((items) => {

          /**
           * This object keys are Place Ids
           * and values are unread counts
           * @const unreadCounts
           * @type {object}
           */
          const unreadCounts = {};

          /**
           * This object keys are Place Ids
           * and values are true if and only if Place have at least one children with unread Post
           * @const unreadChildrens
           * @type {object}
           */
          const unreadChildrens = {};
          items.forEach((element) => {

          /**
           * Place Id
           * @const pid
           * @type {string}
           */
            const pid: string = element.place_id;

            /** Assign Place unread counts to `unreadCounts` */
            unreadCounts[pid] = element.count;

            /**
             * @default
             */
            unreadChildrens[pid] = false;

            /**
             * @const {ISidebarPlace} sidebarPlaceItem - sidebar Place item of this place Id
             */
            const sidebarPlaceItem = this.state.places.find((o) => o.id === pid);

            /**
             * Find Parent Places Of this Place and calculate update all parents `unreadChildrens` state
             */
            if (element.count > 0) {

              /**
               * Iterate on place Depth for ensuring all parents know having children with unread
               */
              for (let j: number = 1; j <= sidebarPlaceItem.depth; j++) {

                /**
                 * @const {string} parentID - sidebar Place item of this place Id
                 */
                const parentID = pid.split('.').splice(0, j).join('.');

                /**
                 * @const {ISidebarPlace} parentElement - sidebar Place item of parent
                 */
                const parentElement = this.state.places.find(
                  (item) => item.id === parentID,
                );
                if (parentElement) {
                  /** Assign children unsean of parent */
                  unreadChildrens[parentID] = true;
                }
              }
            }
          });

          /** save unread Place object in redux store */
          this.props.setUnreadPlaces({
            placesUnreadCounts: unreadCounts,
            placesUnreadChildrens: unreadChildrens,
          });

          /** set State of `sidebarPlacesUnreads` for view rendering */
          this.setState({
            sidebarPlacesUnreads: {
              placesUnreadCounts: unreadCounts,
              placesUnreadChildrens: unreadChildrens,
            },
          });
        });
    }
  }

  /**
   * Get Sidebar places from Store or Server Api
   * And Creates rich object from them for Sidebar view render .
   * @function getMyPlaces
   * @private
   * @memberof Sidebar
   */
  private getMyPlaces() {

    /**
     * Detemines if recieved data is exists assigns to 'places'
     */
    if (this.props.sidebarPlaces.length > 0) {
      this.setState({
        places: JSON.parse(JSON.stringify(this.props.sidebarPlaces)),
      }, () => {

        /**
         * Get Unreads of Places
         */
        this.getUnreads();
      });
    } else {

      /**
       * prepares the Request object for `getAllPlaces` request
       * @const params
       * @type {object}
       */
      // TODO: define interface object of request
      const params = {
        with_children: true,
      };
      this.PlaceApi.getAllPlaces(params)
        .then((response: IPlace) => {

          /**
           * Sort Places Array by Place Ids
           * @const places
           * @type {Array<IPlace>}
           */
          const places = sortBy(response, [(o) => o._id]);

          /**
           * Defaine Sidebar Places array
           * @const placesConjuctions
           * @type {Array<ISidebarPlace>}
           * @kind SidebarPlace
           */
          const placesConjuctions: ISidebarPlace[] = [];
          places.forEach((element, i) => {

            /**
             * Add place to redux store Places
             */
            this.props.placeAdd(element);

            /**
             * @const idSplit
             * @type {array}
             */
            const idSplit = element._id.split('.');

            /**
             * @defaut
             * @const placesConjuction
             * @type {ISidebarPlace}
             */
            const placesConjuction: ISidebarPlace = {
              id: element._id,
              depth: idSplit.length - 1,
              expanded: false,
              isOpen: false,
              hasChildren: false,
              isChildren: false,
            };

            /**
             * Determines the Place Depth
             * User can be out of any parent places of this Place So need to determine the Place depth
             */
            if (idSplit.length > 1) {
              placesConjuction.isChildren = true;

              /**
               * Split of previous Place in Places Array
               * @const prevSplit
               * @type {array}
               */
              const prevSplit = placesConjuctions[i - 1].id.split('.');

              /**
               * @var evaluateDepth
               * how many parent layer should be check
               * @default
               */
              let evaluateDepth: number = 0;

              /**
               * @var actualDepth
               * Depth of this Place
               * @default
               */
              let actualDepth: number = 0;

              /**
               * Flag for stop the iterator and prevent creating unvalid data
               */
              let anyUnMatch: boolean = false;

              /**
               * `evaluateDepth` is related to privious id
               */
              evaluateDepth = prevSplit.length < idSplit.length ? prevSplit.length : idSplit.length - 1;

              /**
               * iterate on `evaluateDepth` to Counts the same Parents of
               * this Place and previous Place then determines `actualDepth`
               */
              for (let d: number = 0; d < evaluateDepth; d++) {
                if (prevSplit[d] === idSplit[d]) {
                  if (!anyUnMatch) {
                    actualDepth++;
                  }
                } else {
                  anyUnMatch = true;
                }
              }

              /** Assign `actualDepth` to Sidebar Place object */
              placesConjuction.depth = actualDepth;
            }

            /**
             * Determines `hasChildren` of previous
             * @fact Last item never have children
             * @fact Place have Children if and only if ID of next place in `Places` array containts this Place ID
             */
            if (placesConjuction.depth > 0) {
              const prv = placesConjuctions[i - 1].id.split('.');
              const newVar = idSplit.slice(0);
              const compareArray = newVar.splice(0, prv.length);
              if (prv.join('.') === compareArray.join('.')) {
                placesConjuctions[i - 1].hasChildren = true;
              }
            }

            /**
             * push The created object to `placesConjuctions`
             */
            placesConjuctions.push(placesConjuction);
          });

          /** set `places` State value to `placesConjuctions` for view rendering */
          this.setState({
            places: placesConjuctions,
          });

          /** save sidebar Places object in redux store */
          this.props.setSidebarPlaces(placesConjuctions);
        }, () => {

        /**
         * Get Unreads of Places
         */
        this.getUnreads();
      });
    }
  }

  /**
   * make all childrens of Place appear/dissapear
   * @function toggleChildren
   * @param {string} placeId
   * @param {number} depth
   * @memberof Sidebar
   */
  public toggleChildren(placeId: string, depth: number) {

    /** Clone the sidebar places to proccess on it */
    const placesMirror = this.state.places.slice(0);

    /** get Place object from paceId */
    const theParentItem = placesMirror.find((item) => {
      return item.id === placeId;
    });

    /** toggle the `isOpen` property of Place object */
    theParentItem.isOpen = !theParentItem.isOpen;

    /**
     * Find next depth childrens places of this place and update related proprties
     */
    const filter = placesMirror.filter(
      (p) => {
        const childrenParent = p.id.split('.').slice(0).splice(0, depth + 1).join('.');

        /**
         * if Children have open Childrens they should be closed too
         * FIXME : childrens differ to depths can make the toggling buggie
         */
        if (p.expanded) {
          return placeId === childrenParent &&
            p.depth >= depth + 1;
        } else {
          return placeId === childrenParent &&
            p.depth === depth + 1;
        }
      },
    );

    /**
     * update related proprties to Place item
     */
    filter.forEach((item) => {
      // Retivice arrow rotation
      item.isOpen = false;
      item.expanded = !item.expanded;
    });

    /**
     * update places state with new data
     */
    this.setState({
      places: placesMirror,
    });
  }

  /**
   * calls after accepting invitation in invitation modal
   * @function
   * @callback
   * @private
   * @memberof Sidebar
   */
  private handleInvitationAccept = () => {
    /** get Places for ensuring invited place adds to sidebar */
    this.getMyPlaces();

    /** get invitations */
    this.getInvitations();
  }

  /**
   * calls after decline invitation in invitation modal
   * @function
   * @callback
   * @private
   * @memberof Sidebar
   */
  private handleInvitationDecline = () => {

    /** get invitations */
    this.getInvitations();
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Sidebar
   * @override
   * @generator
   */
  public render() {
    const placeDoms = [];
    const invDoms = [];
    /**
     * generates JSX elements for invitations
     */
    this.state.invitations.forEach((item, i) => {
      const invDom = (
        <InvitationItem key={i + 'nc'}
                        item={item}
                        onAccept={this.handleInvitationAccept}
                        onDecline={this.handleInvitationDecline}
        />
      );
      invDoms.push(invDom);
    });

    /**
     * generates JSX elements for visible or grand places
     */
    this.state.places.forEach((place, i) => {
      const showCase = !place.isChildren || place.expanded;
      if (showCase) {
        const placeDom = (
          <SidebarItem
            key={place.id + i + 'a'}
            place={place}
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
          {/* Close Sidebar button */}
          <div className={style.sidebarHead} onClick={this.props.closeSidebar}>
            <IcoN size={24} name={'xcross24White'}/>
          </div>
          <ul className={style.sidebarActions}>
            {/* Feed scene link */}
            <li>
              <Link to={`/feed`}>
                <IcoN size={16} name={'bookmarkMessage1White'}/>
                Feed
              </Link>
            </li>
            {/* bookmarks scene link */}
            <li>
              <Link to={`/bookmarks`}>
                <IcoN size={16} name={'bookmarkMessage16White'}/>
                Bookmarked Posts
              </Link>
            </li>
            {/* Shared messages scene link */}
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
            {/* Help center external link */}
            <li>
              <a href={`http://help.nested.me`} target="_blank">
                <IcoN size={16} name={'ask16White'}/>
                Help Center
              </a>
            </li>
            {/* Logging out button */}
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

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store, ownPlops: IOwnProps) => {
  return {
    places: store.places.places,
    sidebarPlaces: store.app.sidebarPlaces,
    sidebarPlacesUnreads: store.app.sidebarPlacesUnreads,
    closeSidebar: ownPlops.closeSidebar,
  };
};

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    placeAdd: (place: IPlace) => (dispatch(placeAdd(place))),
    setSidebarPlaces: (sidebarPlace: ISidebarPlace[]) => (dispatch(setSidebarPlaces(sidebarPlace))),
    setUnreadPlaces: (unreadPlaces: any) => (dispatch(setUnreadPlaces(unreadPlaces))),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import TaskApi from '../../../api/task/index';
import ICustomFilter from '../../../api/task/interfaces/ICustomFilter';

// import {sortBy} from 'lodash';
import {IcoN} from 'components';

const style = require('./sidebar.css');

// import {hashHistory} from 'react-router';

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
  customFilters: ICustomFilter[];
}

/**
 * @name ISidebarState
 * @interface ISidebarState for sidebar reactive Elements
 * @type {object}
 * @property {Array<ISidebarPlace>} places
 * @property {object} placesConjuction have enough datas for sidebar view elements like : Place Children Position
 * @property {IUnreadPlace} sidebarPlacesUnreads TaskSidebar Places unread counts @link{}
 */
interface ISidebarState {
  customFilters?: ICustomFilter[];
}

/**
 * @class TaskSidebar
 * @classdesc Component navigating user to Places Posts, feed, Bookmark, Shared messages
 * and other exernal links
 * @extends {React.Component<ISidebarProps, ISidebarState>}
 * @requires [<IcoN>,<sortBy>,<PlaceApi>,<SidebarItem>]
 */
class TaskSidebar extends React.Component<ISidebarProps, ISidebarState> {
  /**
   * Define PlaceApi
   * @private
   * @type {PlaceApi}
   * @memberof TaskSidebar
   */
  private TaskApi: TaskApi;

  /**
   * @prop sidebarElement
   * @desc Reference of sidebar element
   * @private
   * @type {HTMLDivElement}
   * @memberof TaskSidebar
   */
  private sidebarElement: HTMLDivElement;

  /**
   * @constructor
   * Creates an instance of TaskSidebar.
   * @param {ISidebarProps} props
   * @memberof TaskSidebar
   */
  constructor(props: any) {
    super(props);

    /**
     * @default this.state
     * @type {ISidebarState}
     */
    this.state = {
      customFilters: this.props.customFilters || [],
    };
  }

  /**
   * After mounting component, it starts exploring data
   * @override
   * @function componentDidMount
   * @memberof TaskSidebar
   */
  public componentDidMount() {

    this.sidebarElement.addEventListener('touchmove', (e: any) => {
      e = e || window.event;
      document.body.scrollTop = 0;
      e.stopImmediatePropagation();
      e.cancelBubble = true;
      e.stopPropagation();
    }, false);

    this.TaskApi = new TaskApi();

  }

  /**
   * @func refHandler
   * @private
   * @memberof TaskSidebar
   * @param {HTMLDivElement} value
   */
  private refHandler = (value) => {
    this.sidebarElement = value;
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof TaskSidebar
   * @override
   * @generator
   */
  public render() {
    return (
      <div className={style.sidebar} ref={this.refHandler}>
        <div>
          {/* Close TaskSidebar button */}
          <div className={style.sidebarHead} onClick={this.props.closeSidebar}>
            <IcoN size={24} name={'xcrossWhite24'}/>
          </div>
          <ul className={style.sidebarActions}>
            <li>
              <Link to={`/task/glance`}>
                <IcoN size={16} name={'glance16'}/>
                Glance
              </Link>
            </li>
            <li>
              <Link to={`/task/assigned_to_me/normal`}>
                <IcoN size={16} name={'internal16'}/>
                Assigned to me
              </Link>
            </li>
            <li>
              <Link to={`/task/created_by_me/normal`}>
                <IcoN size={16} name={'external16'}/>
                Created by me
              </Link>
            </li>
            <li>
              <Link to={`/task/watchlist/normal`}>
                <IcoN size={16} name={'raggedList16'}/>
                Watchlist
              </Link>
            </li>
          </ul>
          <ul className={style.filters}>
          {this.state.customFilters.map((filter, i) => (
              <li key={i}>
                {/* horizental rule for grand places */}
                <hr className={style.hrDark}/>
                <hr className={style.hrLight}/>
                <Link to={`/task/custom_filter/${filter.id}`} activeClassName="active">
                  <div className={style.filter}>
                    <IcoN size={16} name={'filter16'}/>
                    <div className={style.indent}/>
                    <span>{filter.name}</span>
                  </div>
                </Link>
              </li>
            ),
          )}
          </ul>
          <hr className={style.hrDark}/>
          <hr className={style.hrLight}/>
          <ul className={style.sidebarActions}>
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
    customFilters: store.app.taskCustomFilters,
    closeSidebar: ownPlops.closeSidebar,
  };
};

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = () => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskSidebar);

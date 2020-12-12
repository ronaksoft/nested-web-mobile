/**
 * @file component/sidebar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description manage the private routes and sidebar open or close actions
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {setPostsRoute} from 'redux/app/actions';
import {PlaceName, OptionsMenu} from 'components';
import C_PLACE_FILES_FILTER from '../place/files/C_PLACE_FILES_FILTER';

import {IUser} from 'api/interfaces';
const style = require('./style.css');

/**
 * @name IState
 * @interface IState for reactive Elements
 * @type {object}
 * @property {boolean} isLogin - state of current user
 * @property {boolean} sidebarOpen - sidebar visibility state
 * @property {number} notificationsCount - counts of unreads notifications
 */
interface IState {
    route: string;
    location: any;
};

/**
 * @name IProps
 * @interface IProps for initials data
 * This interface pass the required parameters for sidebar.
 * @type {object}
 * @property {boolean} isLogin - state of current user
 * @property {IUser} user - current user object
 * @property {function} setNotificationCount - set Counts of unread notifications
 * @property {function} setLogin - athenticate user
 * @property {INotificationCountResponse} notificationsCount - notifications unreads @link{}
 */
interface IProps {
  user: IUser;
  params: string;
  postsRoute: string;
  location: any;
  /**
   * @property setPostsRoute
   * @desc setPostsRoute action which store route of stored posts in redux store
   * @type {function}
   * @memberof IProps
   */
  setPostsRoute: (route: string) => {};
}

/**
 * @class Private
 * @classdesc wrapper for all private scenses also
 * checks the user authentication state
 * @extends {React.Component<IProps, IState>}
 * @requires [<IcoN>,<sortBy>,<PlaceApi>,<SidebarItem>]
 */
class PostsContainer extends React.Component<IProps, IState> {
  public currentPlaceId: string;
  private optionMenu: any;
  private optionMenuHandler = (dom) => this.optionMenu = dom;
  public constructor(props: IProps) {
    super(props);
    const initiateRoute = this.findRouteFromPath(props);
    /**
     * @default this.state
     * @type {IState}
     */
    this.state = {
        route: initiateRoute || 'feed',
        location: this.props.location.pathname,
    };
  }

  private setFilter(filter: string) {
    hashHistory.push(`/places/${this.currentPlaceId}/files/${filter}`);
    // this.setState({
    //   filter,
    // }, () => {
    //   this.initialLoad();
    // });
    this.optionMenu.closeAll();
  }
    /**
     * @desc updates the state object when the parent changes the props
     * @param {IProps} newProps
     * @memberof Feed
     */
    public componentWillReceiveProps(newProps: IProps) {
        const route = this.findRouteFromPath(newProps);
        this.setState({
            location: newProps.location.pathname,
            route,
        });
    }

    public findRouteFromPath(newProps) {
        switch (newProps.location.pathname) {
          case '/feed':
            return 'feed';
          case '/feed/latest-activity':
            return 'feed_latest_activity';

          case '/shared':
            return 'shared';
          case '/bookmarks':
            return 'bookmarks';

            default:
            const routeSplit = newProps.location.pathname.split('/');
            const placeId = routeSplit[2];
            const placePage = routeSplit[3];
            this.currentPlaceId = placeId;
            if (routeSplit[4] && routeSplit[4] === 'latest-activity') {
              return ['place', placeId, 'latestAactivity'].join('_');
            } if (routeSplit[4] && placePage === 'files') {
              return ['place', placeId, placePage, routeSplit[4]].join('_');
            } else {
              return ['place', placeId, placePage].join('_');
            }
        }
      }

  private gotoFeedByActivity() {
    hashHistory.push(`/feed/latest-activity`);
  }
  private gotoFeed() {
    hashHistory.push('/feed');
  }

  private gotoMember() {
    hashHistory.push(`/places/${this.currentPlaceId}/members`);
  }

  private gotoPlacePosts() {
    hashHistory.push(`/places/${this.currentPlaceId}/messages`);
  }

  private gotoPlaceFilses() {
    hashHistory.push(`/places/${this.currentPlaceId}/files/all/`);
  }

  private gotoPlaceActivities() {
    hashHistory.push(`/places/${this.currentPlaceId}/activity`);
  }

  /**
   * @function gotoPlacePostsAllSortedByRecentPost
   * @desc Go to Place post route which are sorted by recent posts by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsAllSortedByRecentPost = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/messages`);
  }
  /**
   * @function gotoPlacePostsAllSortedByActivity
   * @desc Go to Place post route which are sorted by recent activity by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsAllSortedByActivity = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/messages/latest-activity`);
  }
  /**
   * @function gotoPlacePostsUnreadSortedByRecent
   * @desc Go to unread posts route which are sorted by recent post by its `currentPlaceId`
   * @param {IPost} post
   * @private
   */
  private gotoPlacePostsUnreadSortedByRecent = () => {
    hashHistory.push(`/places/${this.currentPlaceId}/unread`);
  }
  /**
   * @function getPost
   * @desc Get posts with declared limits and `before` timestamp of
   * the latest post item in state, otherwise the current timestamp.
   * @param {boolean} fromNow receive post from now (set Date.now for `before`)
   * @param {number} after after timestamp
   * @private
   */
  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
      const latestActivity = this.state.route.indexOf('latestAactivity') > 0;
      let menu: any = {
        leftItem: {
          name: 'Feed',
          type: 'title',
          menu: [],
        },
        rightMenu: [
          {
            name: 'sort24',
            type: 'iconI',
            menu: [
              {
                onClick: null,
                name: 'Sort',
                type: 'kind',
                isChecked: false,
              },
              {
                onClick: this.gotoFeed,
                name: 'Recent Posts',
                isChecked: !latestActivity,
              },
              {
                onClick: this.gotoFeedByActivity,
                name: 'Latest Activity',
                isChecked: latestActivity,
              },
            ],
          },
        ],
      };
      if (this.state.route === 'bookmarks') {
        menu = {
          leftItem: {
            name: 'Bookmarked Posts',
            type: 'title',
            menu: [],
          },
          rightMenu:  [],
        };
      } else if (this.state.route === 'shared') {
        menu = {
          leftItem: {
            name: 'Shared by me',
            type: 'title',
            menu: [],
          },
          rightMenu:  [],
        };
      } else if (this.state.route.indexOf('place') > -1) {
        const page = this.state.route.split('_')[2];
        menu = {
          leftItem: {
            name: <PlaceName place_id={this.currentPlaceId}/>,
            type: 'title',
            menu: [
              {
                onClick: this.gotoPlacePosts.bind(this, ''),
                name: 'Posts',
                isChecked: false,
                icon: {
                  name: 'messages16',
                  size: 16,
                },
              },
              {
                onClick: this.gotoPlaceFilses.bind(this, ''),
                name: 'Files',
                isChecked: false,
                icon: {
                  name: 'file16',
                  size: 16,
                },
              },
              {
                onClick: this.gotoPlaceActivities.bind(this, ''),
                name: 'Activity',
                isChecked: false,
                icon: {
                  name: 'log16',
                  size: 16,
                },
              },
            ],
          },
          rightMenu: [
            {
              name: 'sort24',
              type: 'iconI',
              menu: [
                {
                  name: 'Sort',
                  type: 'kind',
                  isChecked: false,
                },
                {
                  onClick: this.gotoPlacePostsAllSortedByRecentPost,
                  name: 'Recent Posts',
                  isChecked: !latestActivity,
                },
                {
                  onClick: this.gotoPlacePostsAllSortedByActivity,
                  name: 'Latest Activity',
                  isChecked: latestActivity,
                },
                {
                  name: 'Filter',
                  type: 'kind',
                  isChecked: false,
                },
                {
                  onClick: this.gotoPlacePosts.bind(this, ''),
                  name: 'All',
                  isChecked: this.state.route.indexOf('_unread_') === -1,
                },
                {
                  onClick: this.gotoPlacePostsUnreadSortedByRecent,
                  name: 'Unseens',
                  isChecked: this.state.route.indexOf('_unread_') > -1,
                },
              ],
            },
          ],
        };
        if (page === 'activity') {
          menu.leftItem.name = <span><strong>Activities:</strong> <PlaceName place_id={this.currentPlaceId}/></span>;
          menu.leftItem.menu[2].isChecked = true;
          menu.rightMenu = [];
        } else if (page === 'files') {
          const filter = this.state.route.split('_')[3];
          menu.leftItem.name = <span><strong>Files:</strong> <PlaceName place_id={this.currentPlaceId}/></span>;
          menu.leftItem.menu[1].isChecked = true;
          menu.rightMenu = [
            {
              name: 'filter24',
              type: 'iconI',
              menu: [
                {
                  name: 'Filter',
                  type: 'kind',
                  isChecked: false,
                },
                {
                  onClick: this.setFilter.bind(this, C_PLACE_FILES_FILTER.all),
                  name: 'All',
                  isChecked: filter === C_PLACE_FILES_FILTER.all,
                },
                {
                  onClick: this.setFilter.bind(this, C_PLACE_FILES_FILTER.DOC),
                  name: 'Document',
                  isChecked: filter  === C_PLACE_FILES_FILTER.DOC,
                },
                {
                  onClick: this.setFilter.bind(this, C_PLACE_FILES_FILTER.IMG),
                  name: 'Photo',
                  isChecked: filter  === C_PLACE_FILES_FILTER.IMG,
                },
                {
                  onClick: this.setFilter.bind(this, C_PLACE_FILES_FILTER.VID),
                  name: 'Video',
                  isChecked: filter  === C_PLACE_FILES_FILTER.VID,
                },
                {
                  onClick: this.setFilter.bind(this, C_PLACE_FILES_FILTER.AUD),
                  name: 'Audio',
                  isChecked: filter  === C_PLACE_FILES_FILTER.AUD,
                },
                {
                  onClick: this.setFilter.bind(this, C_PLACE_FILES_FILTER.OTH),
                  name: 'Other',
                  isChecked: filter  === C_PLACE_FILES_FILTER.OTH,
                },
              ],
            },
          ];
        } else if (page === 'members') {
          menu.leftItem.name = <span><strong>Members:</strong> <PlaceName place_id={this.currentPlaceId}/></span>;
          // menu.leftItem.menu[3].isChecked = true;
          menu.rightMenu = [];
        } else {
          menu.leftItem.menu[0].isChecked = true;
        }
        if (!this.props.user || this.currentPlaceId !== this.props.user._id) {
          menu.leftItem.menu.push(
            {
              onClick: this.gotoMember.bind(this),
              name: 'Members',
              isChecked: false,
              icon: {
                name: 'placeMember16',
                size: 16,
              },
            },
          );
        }
      }
    return (
        <div className={style.container}>
          <OptionsMenu leftItem={menu.leftItem} rightItems={menu.rightMenu}
            ref={this.optionMenuHandler}/>
          {this.props.children}
        </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store) => ({
  user: store.app.user,
  postsRoute: store.app.postsRoute,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setPostsRoute: (route: string) => {
      dispatch(setPostsRoute(route));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsContainer);

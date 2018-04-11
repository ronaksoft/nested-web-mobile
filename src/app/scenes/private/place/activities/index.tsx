import * as React from 'react';
import {connect} from 'react-redux';
import PlaceApi from '../../../../api/place';
import IGetActivitiesRequest from '../../../../api/place/interfaces/IGetActivitiesRequest';
import {OptionsMenu, PlaceName, InfiniteScroll, Loading} from 'components';
// import * as _ from 'lodash';
import {hashHistory} from 'react-router';
import IActivity from '../../../../api/place/interfaces/IActivity';
import ActivityItem from '../../../../components/ActivityItem/';
import {setActivities} from '../../../../redux/app/actions/index';
// import {Modal, message} from 'antd';

const style = require('./activities.css');
const privateStyle = require('../../private.css');

interface IOwnProps {
  /**
   * @property params
   * @desc parameters that received from route (react-router)
   * @type {any}
   * @memberof IProps
   */
  params?: any;
  /**
   * @property location
   * @desc location object that received from react-router
   * @type {any}
   * @memberof IProps
   */
  location: any;

}
/**
 * @interface IProps
 */
interface IProps {
  /**
   * @property params
   * @desc parameters that received from route (react-router)
   * @type {any}
   * @memberof IProps
   */
  params: any;
  /**
   * @property location
   * @desc location object that received from react-router
   * @type {any}
   * @memberof IProps
   */
  location: any;
  activities: any;
  setActivities: (acts: any) => void;
}

/**
 * @interface IState
 */
interface IState {
  /**
   * @property reachedTheEnd
   * @desc hide loading  if `reachedTheEnd` is true
   * @type {boolean}
   * @memberof IState
   */
  reachedTheEnd: boolean;
  placeId: string;
  activities: IActivity[];
  skip: number;
  limit: number;
  initialLoad: boolean;
}

/**
 * @class Members
 * @classdesc Component renders the Members posts page
 * @extends {React.Component<IProps, IState>}
 */
class Activities extends React.Component<IProps, IState> {

  private placeApi: PlaceApi;
  private loading: boolean;

  /**
   * Creates an instance of Members.
   * @constructor
   * @param {*} props
   * @memberof Members
   */
  constructor(props: IProps) {

    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      reachedTheEnd: false,
      placeId: props.params.placeId,
      activities: this.props.activities[props.params.placeId] || [],
      skip: 0,
      limit: 100,
      initialLoad: false,
    };

    this.loading = false;
  }

  private gotoPlacePosts() {
    hashHistory.push(`/places/${this.state.placeId}/messages`);
  }

  private gotoPlaceMembers() {
    hashHistory.push(`/places/${this.state.placeId}/members`);
  }

  private gotoPlaceFiles() {
    hashHistory.push(`/places/${this.state.placeId}/files`);
  }

  /**
   * Component Did Mount ( what ?!)
   * @desc Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof Members
   * @override
   */
  public componentDidMount() {
    /**
     * define the Post Api
     */
    this.placeApi = new PlaceApi();
    this.initialLoad();
  }

  private initialLoad() {
    const params: IGetActivitiesRequest = {
      place_id: this.state.placeId,
      skip: 0,
      details: true,
      limit: this.state.limit,
    };
    this.loading = true;
    this.placeApi.getActivities(params).then((acts) => {
      this.addToActivities(acts);
      if (acts.length < this.state.limit) {
        this.setState({
          reachedTheEnd: true,
          initialLoad: true,
        });
      } else {
        this.setState({
          skip: this.state.skip + this.state.limit,
          initialLoad: true,
        });
      }
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });

  }

  private addToActivities(activities: IActivity[]) {
    const state = {};
    state[this.props.params.placeId] = [...this.state.activities, ...activities];
    this.props.setActivities(state);
    // this.setState({
    //   activities: state[this.props.params.placeId],
    // }, () => console.log(this.state.activities));
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      activities: newProps.activities[this.props.params.placeId] || [],
      initialLoad: true,
    });
  }
  private refresh = () => {
    this.setState({
      reachedTheEnd: false,
      activities: [],
      skip: 0,
      initialLoad: false,
    }, () => {
      this.initialLoad();
    });
  }

  private loadMore = () => {
    if (!this.state.reachedTheEnd && !this.loading) {
      const params: IGetActivitiesRequest = {
        place_id: this.state.placeId,
        skip: this.state.skip,
        details: true,
        limit: this.state.limit,
      };
      this.loading = true;
      this.placeApi.getActivities(params).then((acts) => {
        this.addToActivities(acts);
        if (acts.length < this.state.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        } else {
          this.setState({
            skip: this.state.skip + this.state.limit,
          });
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Members
   * @generator
   */
  public render() {
    const topMenu = {
      left: {
        name: <span><strong>Activities:</strong> <PlaceName place_id={this.state.placeId}/></span>,
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
            onClick: this.gotoPlaceFiles.bind(this, ''),
            name: 'files',
            isChecked: false,
            icon: {
              name: 'file16',
              size: 16,
            },
          },
          {
            onClick: null,
            name: 'Activity',
            isChecked: true,
            icon: {
              name: 'log16',
              size: 16,
            },
          },
          {
            onClick: this.gotoPlaceMembers.bind(this, ''),
            name: 'Members',
            isChecked: false,
            icon: {
              name: 'placeMember16',
              size: 16,
            },
          },
        ],
      },
      right: [],
    };
    return (
      <div style={{height: '100%'}}>
        <OptionsMenu leftItem={topMenu.left} rightItems={topMenu.right}/>
        {this.state.activities.length > 0 && (
          <InfiniteScroll
            pullDownToRefresh={true}
            refreshFunction={this.refresh}
            next={this.loadMore}
            route={'activities_' + this.state.placeId}
            hasMore={true}
            loader={<Loading active={!this.state.reachedTheEnd} position="fixed"/>}>
            {this.state.activities.map((act, index) => {
              return (
                <div key={act._id + index} className={style.actsContainer}>
                  <ActivityItem act={act} placeId={this.props.params.placeId}/>
                </div>
              );
            })}
            {this.state.reachedTheEnd &&
              <div className={privateStyle.emptyMessage}>No more activity here!</div>
            }
            <div className={privateStyle.bottomSpace}/>
          </InfiniteScroll>
        )}
        {this.state.activities.length === 0 && this.state.initialLoad && (
          <div className={privateStyle.emptyMessage}>
            {this.state.activities.length === 0 && <span>There are no activity here yet...</span>}
          </div>
        )}
        <Loading position="absolute" active={!this.state.initialLoad && this.state.activities.length === 0}/>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  activities: store.app.activities,
  params: ownProps.params,
  location: ownProps.location,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setActivities: (acts: any) => {
      dispatch(setActivities(acts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);


import * as React from 'react';
import {OptionsMenu} from 'components';

import {connect} from 'react-redux';
import TaskApi from '  ../../../api/task/index';
import ClientApi from '  ../../../api/client/index';
import ITask from '  ../../../api/task/interfaces/ITask';
import ICustomFilter from '  ../../../api/task/interfaces/ICustomFilter';
import ITaskGetByFilterRequest from '  ../../../api/task/interfaces/ITaskGetByFilterRequest';
import IGetTasksResponse from '  ../../../api/task/interfaces/IGetTasksResponse';
import IGetTaskCustomFilterRequest from '  ../../../api/task/interfaces/IGetTaskCustomFilterRequest';
import ICustomFilterFilter from '  ../../../api/task/interfaces/ICustomFilterFilter';
import C_TASK_FILTER from '../../../api/task/consts/taskFilterConst';
import C_TASK_CUSTOM_FILTER from '../../../api/consts/CTaskCustomFilter';
import C_TASK_STATUS from '../../../api/consts/CTaskStatus';
import {setCurrentTask, setTasks, setTasksRoute, setTasksFilter} from '  ../../../redux/app/actions/index';
import ArrayUntiles from '  ../../../services/utils/array';
import {Button, message} from 'antd';
import {hashHistory} from 'react-router';
import {Loading} from '  ../../../components/Loading/index';
// import TaskCandidateView from './components/list/candidateItem/index';
import TaskUpcomingView from './components/list/upcomingItem/index';

const style = require('./task.css');
const privateStyle = require('../private.css');

interface IProps {
  tasksRoute: string;
  routing: any;
  tasks: ITask[] | any;
  currentTask: ITask | null;
  setTasks: (tasks: ITask[] | any) => {};
  setTasksRoute: (route: string) => {};
  setCurrentTask: (task: ITask) => {};
  setTasksFilter: (filters: ICustomFilter[]) => void;
  customFilters: ICustomFilter[];
  location: any;
}

interface IState {
  tasks: ITask[];
  overDueTasks: ITask[];
  candidateTasks: ITask[];
  customFilters: ICustomFilter[];
  loadingAfter: boolean;
  loadingBefore: boolean;
  reachedTheEnd: boolean;
  newPostCount: number;
  location: any;
  route: string;
}

/**
 * @class Tasks
 * @classdesc Component renders the Feed posts page
 * @extends {React.Component<IProps, IState>}
 */
class Tasks extends React.Component<IProps, IState> {
  private taskApi: TaskApi;
  private ClientApi: ClientApi;

  constructor(props: IProps) {

    super(props);
    const initiateRoute = this.findRouteFromPath(props);
    this.state = {
      tasks: this.props.location.pathname === this.props.tasksRoute
        ? this.props.tasks[initiateRoute] || []
        : [],
      overDueTasks: this.props.location.pathname === this.props.tasksRoute
        ? this.props.tasks.overDueTasks || []
        : [],
      candidateTasks: this.props.location.pathname === this.props.tasksRoute
        ? this.props.tasks.candidateTasks || []
        : [],
      location: this.props.location,
      loadingAfter: false,
      loadingBefore: false,
      customFilters: this.props.customFilters || [],
      reachedTheEnd: false,
      newPostCount: 0,
      route: initiateRoute || 'glance',
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    let route = this.state.route;
    if (this.state.location !== newProps.location.pathname) {
      route = this.findRouteFromPath(newProps);
      if (route === 'glance') {
        this.getOverDueTasks();
        this.getCandidateTasks();
      }
    }
    const oldLocation = this.state.location;
    this.setState({tasks: newProps.tasks[route] || [], location: newProps.location.pathname, route}, () => {
      if (oldLocation !== newProps.location.pathname) {
        if (route.indexOf('filter') > -1) {
          if (this.state && this.state.customFilters.length > 0) {
            this.getTasksByCustom(true);
          } else {
            this.getMyFilters().then(() => {
              this.getTasksByCustom(true);
            });
          }
        } else {
          this.getTasks(true);
        }
      }
    });
  }

  public findRouteFromPath(newProps) {
    switch (newProps.location.pathname) {
      case '/task/glance':
        return 'glance';

      case '/task/watchlist/normal':
        return 'watchlist';
      case '/task/watchlist/completed':
        return 'watchlist_completed';

      case '/task/assigned_to_me/normal':
        return 'assigned_to_me';
      case '/task/assigned_to_me/completed':
        return 'assigned_to_me_completed';

      case '/task/created_by_me/normal':
        return 'created_by_me';
      case '/task/created_by_me/completed':
        return 'created_by_me_completed';

      default:
        const filterId = newProps.location.pathname.split('/')[newProps.location.pathname.split('/').length - 1];
        return 'filter-' + filterId;
    }
  }

  public componentDidMount() {
    const isSafari = navigator.userAgent.toLowerCase().match(/(ipad|iphone)/);
    if ( this.scrollWrapper ) {
      if (isSafari) {
        this.scrollWrapper.addEventListener('touchmove', (e: any) => {
          e = e || window.event;
          e.stopImmediatePropagation();
          e.cancelBubble = true;
          e.stopPropagation();
          e.returnValue = true;
          return true;
        }, false);
        this.scrollWrapper.addEventListener('touchstart', (e: any) => {
          e = e || window.event;
          e.currentTarget.scrollTop += 1;
          e.stopImmediatePropagation();
          e.cancelBubble = true;
          e.stopPropagation();
          e.returnValue = true;
          return true;
        }, false);

      }
      this.scrollWrapper.addEventListener('scroll', (e: any) => {
        e = e || window.event;
        const el = e.currentTarget;
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();
        if (el.scrollTop === 0) {
            el.scrollTop = 1;
        } else if (el.scrollHeight === el.clientHeight + el.scrollTop) {
          el.scrollTop -= 1;
        }
        e.returnValue = true;
        return true;
      }, true);
    }
    this.taskApi = new TaskApi();
    this.ClientApi = new ClientApi();
    this.getMyFilters();
    // this.getTasks(true);
    // if (this.props.currentTask) {
    //   setTimeout(() => {
    //       window.scrollTo(0, this.getOffset(this.props.currentTask._id).top - 400);
    //     },
    //     200);
    // }
  }

  /**
   * Get TaskSidebar places from Store or Server Api
   * And Creates rich object from them for TaskSidebar view render .
   * @function getMyPlaces
   * @private
   * @memberof TaskSidebar
   */
  private getMyFilters() {
    const promise = new Promise((res, rej) => {
      this.ClientApi.read(C_TASK_CUSTOM_FILTER.KEY_NAME).then((result: any) => {
        if (result) {
          const customFilters = JSON.parse(result);
          this.props.setTasksFilter(customFilters);
          // TODO check if is mounted
          this.setState({
            customFilters,
          });
          res(customFilters);
        }
      }).catch(rej);
    });
    return promise;
  }

  private getCustomFilterParams(filters: ICustomFilterFilter[]) {
    const params: IGetTaskCustomFilterRequest = {};
    let statusFilter = [];
    for (const i in filters) {
      if (filters.hasOwnProperty(i)) {
        switch (filters[i].con) {
          case C_TASK_CUSTOM_FILTER.CONDITION_STATUS:
            statusFilter = [];
            if (filters[i].val === C_TASK_CUSTOM_FILTER.STATUS_OVERDUE) {
              statusFilter.push(C_TASK_STATUS.OVERDUE);
            } else if (filters[i].val === C_TASK_CUSTOM_FILTER.STATUS_HOLD) {
              statusFilter.push(C_TASK_STATUS.HOLD);
            } else {
              statusFilter.push(C_TASK_STATUS.NO_ASSIGNED);
              statusFilter.push(C_TASK_STATUS.ASSIGNED);
            }
            params.status_filter = statusFilter.join(',');
            break;
          case C_TASK_CUSTOM_FILTER.CONDITION_ASSIGNOR:
            params.assignor_id = this.getNormCommaSeparated(filters[i].val);
            break;
          case C_TASK_CUSTOM_FILTER.CONDITION_ASSIGNEE:
            params.assignee_id = this.getNormCommaSeparated(filters[i].val);
            break;
          case C_TASK_CUSTOM_FILTER.CONDITION_LABEL:
            params.label_title = this.getNormCommaSeparated(filters[i].val);
            params['label.logic'] = filters[i].eq === C_TASK_CUSTOM_FILTER.LOGIC_AND ? 'and' : 'or';
            break;
          case C_TASK_CUSTOM_FILTER.CONDITION_KEYWORD:
            params.keyword = filters[i].val;
            break;
          case C_TASK_CUSTOM_FILTER.CONDITION_DUE_TIME:
            params.due_data_until = parseInt(filters[i].val, 10);
            break;
          default:
            break;
        }
      }
    }
    return params;
  }

  private getNormCommaSeparated(str) {
    return str.split(',').map((item) => item.replace(/ /g, '')).filter((item) => item.length > 1).join(',');
  }

  private getFilterForApi() {
    switch (this.state.route) {
      case 'glance':
         return C_TASK_FILTER[C_TASK_FILTER.upcoming];
      case 'watchlist':
      case 'watchlist_completed':
         return C_TASK_FILTER[C_TASK_FILTER.watched];
      case 'created_by_me':
      case 'created_by_me_completed':
         return C_TASK_FILTER[C_TASK_FILTER.created_by_me];
      case 'assigned_to_me':
      case 'assigned_to_me_completed':
         return C_TASK_FILTER[C_TASK_FILTER.assigned_to_me];
      default:
        break;
    }
  }

  private getOverDueTasks() {

    const params: ITaskGetByFilterRequest = {
      filter: C_TASK_FILTER[C_TASK_FILTER.assigned_to_me],
      status_filter: '',
    };
    const statusFilter = [C_TASK_STATUS.OVERDUE];

    params.status_filter = statusFilter.join(',');

    this.taskApi.getByFilter(params)
      .then((response: IGetTasksResponse) => {
        const overDueTasks = ArrayUntiles.uniqueObjects(response.tasks.concat(this.state.overDueTasks), '_id')
          .sort((a: ITask, b: ITask) => {
            return b.timestamp - a.timestamp;
          });

        this.props.setTasks({overDueTasks});
        this.setState({
          overDueTasks,
        });
      })
      .catch(() => {
        message.success('An error has occurred.', 10);
      });
  }

  private getCandidateTasks() {

    const params: ITaskGetByFilterRequest = {
      filter: C_TASK_FILTER[C_TASK_FILTER.candidate],
      status_filter: '',
    };
    const statusFilter = [C_TASK_STATUS.NO_ASSIGNED];

    params.status_filter = statusFilter.join(',');

    this.taskApi.getByFilter(params)
      .then((response: IGetTasksResponse) => {
        const candidateTasks = ArrayUntiles.uniqueObjects(response.tasks.concat(this.state.candidateTasks), '_id')
          .sort((a: ITask, b: ITask) => {
            return b.timestamp - a.timestamp;
          });
        this.props.setTasks({candidateTasks});
        this.setState({
          candidateTasks,
        });
      })
      .catch(() => {
        message.success('An error has occurred.', 10);
      });
  }

  /**
   * @function getPost
   * @desc Get posts with declared limits and `before` timestamp of
   * the latest post item in state, otherwise the current timestamp.
   * @param {boolean} fromNow receive post from now (set Date.now for `before`)
   * @param {number} after after timestamp
   * @private
   */
  private getTasks(fromNow?: boolean, after?: number) {

    const params: ITaskGetByFilterRequest = {
      filter: this.getFilterForApi(),
      status_filter: null,
    };
    const completedResult = this.state.route.indexOf('completed') > -1;
    const statusFilter = [];
    if (fromNow === true) {
      params.before = Date.now();
      // show bottom loading
      this.setState({
        loadingBefore: true,
      });
    } else if (typeof after === 'number') {
        params.after = after;
      // show top loading
      this.setState({
        loadingAfter: true,
      });
    } else {
      // show bottom loading
      this.setState({
        loadingBefore: true,
      });
      /**
       * check state posts length for state `before` timestamp
       */
      if (this.state.tasks.length === 0) {
        params.before = Date.now();
      } else {
        params.before = this.state.tasks[this.state.tasks.length - 1].timestamp;
      }
    }
    if (this.state.route.indexOf('assigned_to_me') > -1) {
      if (completedResult) {
        statusFilter.push(C_TASK_STATUS.COMPLETED);
        statusFilter.push(C_TASK_STATUS.FAILED);
      } else {
        statusFilter.push(C_TASK_STATUS.ASSIGNED);
        statusFilter.push(C_TASK_STATUS.HOLD);
        statusFilter.push(C_TASK_STATUS.OVERDUE);
      }
    } else if (this.state.route.indexOf('created_by_me') > -1) {
      if (completedResult) {
        statusFilter.push(C_TASK_STATUS.COMPLETED);
        statusFilter.push(C_TASK_STATUS.FAILED);
      } else {
        statusFilter.push(C_TASK_STATUS.NO_ASSIGNED);
        statusFilter.push(C_TASK_STATUS.ASSIGNED);
        statusFilter.push(C_TASK_STATUS.CANCELED);
        statusFilter.push(C_TASK_STATUS.REJECTED);
        statusFilter.push(C_TASK_STATUS.HOLD);
        statusFilter.push(C_TASK_STATUS.OVERDUE);
      }
    } else if (this.state.route.indexOf('watchlist') > -1) {
      if (completedResult) {
        statusFilter.push(C_TASK_STATUS.COMPLETED);
        statusFilter.push(C_TASK_STATUS.FAILED);
      } else {
        statusFilter.push(C_TASK_STATUS.NO_ASSIGNED);
        statusFilter.push(C_TASK_STATUS.ASSIGNED);
        statusFilter.push(C_TASK_STATUS.CANCELED);
        statusFilter.push(C_TASK_STATUS.REJECTED);
        statusFilter.push(C_TASK_STATUS.HOLD);
        statusFilter.push(C_TASK_STATUS.OVERDUE);
      }
    }
    params.status_filter = statusFilter.join(',');

    params.limit = 100;
    this.taskApi.getByFilter(params)
      .then((response: IGetTasksResponse) => {
        // if length of received post is less than limit, set `reachedTheEnd` as true
        if (this.state.tasks.length > 0 && response.tasks.length < params.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }
        /**
         * concat received post items with current items and unique array by identifiers (`_id`)
         * and sorting the post items by date
         * @type {IPost[]}
         */
        const tasks = ArrayUntiles.uniqueObjects(response.tasks.concat(this.state.tasks), '_id')
          .sort((a: ITask, b: ITask) => b.timestamp - a.timestamp);
        // store current state post and route in redux store, if `fromNow` was true
        if (fromNow === true) {
          const tasksObj = {};
          tasksObj[this.state.route] = tasks;
          this.props.setTasks(tasksObj);
          this.props.setTasksRoute(this.props.location.pathname);
        }

        this.setState({
          loadingBefore: false,
          loadingAfter: false,
        });
      })
      .catch(() => {
        message.success('An error has occurred.', 10);
      });
  }

  private getTasksByCustom(fromNow?: boolean, after?: number) {
    const route = this.state.route;
    const filterId = parseInt(route.split('-')[1], 10);
    const filterData: ICustomFilter = this.state.customFilters.find((fi) => parseInt(fi.id, 10) === filterId);
    const filter: IGetTaskCustomFilterRequest = this.getCustomFilterParams(filterData.filters);
    if (fromNow === true) {
      filter.before = Date.now();
      // show bottom loading
      this.setState({
        loadingBefore: true,
      });
    } else if (typeof after === 'number') {
      filter.after = after;
      // show top loading
      this.setState({
        loadingAfter: true,
      });
    } else {
      // show bottom loading
      this.setState({
        loadingBefore: true,
      });
      /**
       * check state posts length for state `before` timestamp
       */
      if (this.state.tasks.length === 0) {
        filter.before = Date.now();
      } else {
        filter.before = this.state.tasks[this.state.tasks.length - 1].timestamp;
      }
    }

    filter.limit = 20;
    this.taskApi.getByCustomFilter(filter)
      .then((response: IGetTasksResponse) => {
        // if length of received post is less than limit, set `reachedTheEnd` as true
        if (this.state.tasks.length > 0 && response.tasks.length < filter.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        }
        /**
         * concat received post items with current items and unique array by identifiers (`_id`)
         * and sorting the post items by date
         * @type {IPost[]}
         */
        const tasks = ArrayUntiles.uniqueObjects(response.tasks.concat(this.state.tasks), '_id')
          .sort((a: ITask, b: ITask) => {
            return b.timestamp - a.timestamp;
          });
        // store current state post and route in redux store, if `fromNow` was true
        if (fromNow === true) {
          const tasksObj = {};
          tasksObj[route] = tasks;
          this.props.setTasks(tasksObj);
          this.props.setTasksRoute(this.props.location.pathname);
        }

        this.setState({
          loadingBefore: false,
          loadingAfter: false,
        });
      })
      .catch(() => {
        message.success('An error has occurred.', 10);
      });
  }

  /**
   * @function getOffset
   * @desc Get offset of post by `id` of html element
   * @param {string} id, id of html element
   * @returns {{left: number, top: number}}
   * @private
   */
  // private getOffset(id: string) {
  //   if (!document.getElementById(id)) {
  //     return {
  //       top : 0,
  //       left : 0,
  //     };
  //   }
  //   const el = document.getElementById(id).getBoundingClientRect();
  //   return {
  //     left: el.left + window.scrollX,
  //     top: el.top + window.scrollY,
  //   };
  // }

  /**
   * @prop scrollWrapper
   * @desc Reference of  scroll element
   * @private
   * @type {HTMLDivElement}
   * @memberof Feed
   */
  private scrollWrapper: HTMLDivElement;

  private refHandler = (value) => {
    this.scrollWrapper = value;
  }

  private gotoTask(task: ITask) {
    console.log(task);
    // this.props.setCurrentTask(task);
    // hashHistory.push(`/task/edit/${task._id}`);
  }

  private getLeftItemMenu() {
    let leftItem: any = {
      name: 'Glance',
      type: 'title',
      menu: [],
    };
    if (this.state.route === 'assigned_to_me') {
      leftItem = {
        name: <span><b>Assigned to Me</b></span>,
        type: 'title',
        menu: [
          {
            onClick: () => hashHistory.push(`/task/assigned_to_me/normal`),
            name: 'UnFinished',
            type: 'kind',
            isChecked: true,
            icon: '',
          },
          {
            onClick: () => hashHistory.push(`/task/assigned_to_me/completed`),
            name: 'Finished',
            isChecked: false,
            icon: '',
          },
        ],
      };
    } else if (this.state.route === 'assigned_to_me_completed') {
      leftItem = {
        name: <span><b>Assigned to me</b> completed</span>,
        type: 'title',
        menu: [
          {
            onClick: () => hashHistory.push(`/task/assigned_to_me/normal`),
            name: 'UnFinished',
            type: 'kind',
            isChecked: false,
            icon: '',
          },
          {
            onClick: () => hashHistory.push(`/task/assigned_to_me/completed`),
            name: 'Finished',
            isChecked: true,
            icon: '',
          },
        ],
      };
    } else if (this.state.route === 'created_by_me') {
      leftItem = {
        name: <span><b>Created to Me</b></span>,
        type: 'title',
        menu: [
          {
            onClick: () => hashHistory.push(`/task/created_by_me/normal`),
            name: 'UnFinished',
            type: 'kind',
            isChecked: true,
            icon: '',
          },
          {
            onClick: () => hashHistory.push(`/task/created_by_me/completed`),
            name: 'Finished',
            isChecked: false,
            icon: '',
          },
        ],
      };
    } else if (this.state.route === 'created_by_me_completed') {
      leftItem = {
        name: <span><b>Created to Me</b> Completed</span>,
        type: 'title',
        menu: [
          {
            onClick: () => hashHistory.push(`/task/created_by_me/normal`),
            name: 'UnFinished',
            type: 'kind',
            isChecked: false,
            icon: '',
          },
          {
            onClick: () => hashHistory.push(`/task/created_by_me/completed`),
            name: 'Finished',
            isChecked: true,
            icon: '',
          },
        ],
      };
    } else if (this.state.route === 'watchlist') {
      leftItem = {
        name: <span><b>Watchlist</b></span>,
        type: 'title',
        menu: [
          {
            onClick: () => hashHistory.push(`/task/watchlist/noraml`),
            name: 'UnFinished',
            type: 'kind',
            isChecked: true,
            icon: '',
          },
          {
            onClick: () => hashHistory.push(`/task/watchlist/completed`),
            name: 'Finished',
            isChecked: false,
            icon: '',
          },
        ],
      };
    } else if (this.state.route === 'watchlist_completed') {
      leftItem = {
        name: <span><b>Watchlist</b> Completed</span>,
        type: 'title',
        menu: [
          {
            onClick: () => hashHistory.push(`/task/watchlist/normal`),
            name: 'UnFinished',
            type: 'kind',
            isChecked: false,
            icon: '',
          },
          {
            onClick: () => hashHistory.push(`/task/watchlist/completed`),
            name: 'Finished',
            isChecked: true,
            icon: '',
          },
        ],
      };
    } else if (this.state.route.indexOf('filter') > -1) {
      const filterId = parseInt(this.state.route.split('-')[1], 10);
      const filterData: ICustomFilter = this.state.customFilters.find((fi) => parseInt(fi.id, 10) === filterId);
      leftItem = {
        name: filterData ? filterData.name : 'Custom filter',
        type: 'title',
        menu: [],
      };
    }
    return leftItem;
  }

  public render() {
    const loadMore = this.getTasks.bind(this);
    const leftItem = this.getLeftItemMenu();
    if (this.scrollWrapper && this.scrollWrapper.scrollTop === 0) {
      this.scrollWrapper.scrollTop += 1;
    }
    const showOverDue = this.state.route === 'glance' && this.state.overDueTasks.length > 0;
    const showCandidate = this.state.route === 'glance' && this.state.candidateTasks.length > 0;
    return (
      <div className={style.tasksContainer}>
        <OptionsMenu leftItem={leftItem} rightItems={[]}/>
        <div className={[privateStyle.tasksArea, style.tasksList].join(' ')} ref={this.refHandler}>
          {/* rendering Loading component in  `loadingAfter` case */}
          <Loading active={this.state.loadingAfter} position="absolute"/>
          {this.state.loadingAfter &&
            <div>Loading new posts...</div>
          }
          {showOverDue && <h3 className={style.force}>Overdue Tasks</h3>}
          {showOverDue && this.state.overDueTasks.map((task: ITask) => (
            <div key={task._id} onClick={this.gotoTask.bind(this, task)}>
              <TaskUpcomingView task={task} />
            </div>
          ))}
          {showCandidate && <h3 className={style.pending}>You’ve been Candidated to do this…</h3>}
          {showCandidate && this.state.candidateTasks.map((task: ITask) => (
            <div key={task._id} onClick={this.gotoTask.bind(this, task)}>
              <TaskUpcomingView task={task} />
            </div>
          ))}
          {/* after Loading component render posts list */}
          {this.state.route === 'glance' && <h3>Upcomings</h3>}
          {this.state.tasks.map((task: ITask) => (
            <div key={task._id} onClick={this.gotoTask.bind(this, task)}>
              <TaskUpcomingView task={task} withDetails={this.state.route !== 'glance'}
                from={this.state.route !== 'created_by_me' && this.state.route !== 'created_by_me_completed'}
                to={this.state.route !== 'assigned_to_me' && this.state.route !== 'assigned_to_me_completed'}/>
            </div>
          ))}
          {/* rendering Loading component in  `loadingBefore` case */}
          <Loading active={this.state.loadingBefore} position="absolute"/>
          {/* rendering following text when there is no post in Feed */}
          {
            !this.state.reachedTheEnd &&
            !this.state.loadingAfter &&
            !this.state.loadingBefore &&
            this.state.tasks.length === 0 &&
            (
              <div className={privateStyle.emptyMessage}>
                You have no Tasks until next year...
                <div className={style.loadMore}>
                  <Button onClick={loadMore}>Try again</Button>
                </div>
              </div>
            )
          }
          {this.state.reachedTheEnd &&
          <div className={privateStyle.emptyMessage}>No more tasks here!</div>
          }
          {!this.state.reachedTheEnd &&
          !this.state.loadingBefore && !this.state.loadingAfter && (
            <div className={privateStyle.loadMore}>
              {/* Load More button */}
              <Button onClick={loadMore}>Load More</Button>
            </div>
          )}
          <div className={privateStyle.bottomSpace}/>
        </div>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store) => ({
  customFilters: store.app.taskCustomFilters,
  tasksRoute: store.app.tasksRoute,
  tasks: store.app.tasks,
  currentTask: store.app.currentTask,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setTasks: (tasks: ITask[]| any) => {
      dispatch(setTasks(tasks));
    },
    setCurrentTask: (tasks: ITask) => {
      dispatch(setCurrentTask(tasks));
    },
    setTasksRoute: (route: string) => {
      dispatch(setTasksRoute(route));
    },
    setTasksFilter: (filter: ICustomFilter[]) => (dispatch(setTasksFilter(filter))),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);

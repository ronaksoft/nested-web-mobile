/**
 * @file scenes/private/posts/components/post/index.tsx
 * @author robzizo <me@robzizo.ir>
 * @description A task view component
 * Documented by:          robzizo <me@robzizo.ir>
 * Date of documentation:  2018-02-24
 * Reviewed by:            -
 * Date of review:         -
 */

import * as React from 'react';
import ITask from '../../../../../api/task/interfaces/ITask';
import {IcoN, Loading, InfiniteScroll} from 'components';
import TaskApi from '../../../../../api/task/index';
import {connect} from 'react-redux';
import {setCurrentTask} from '../../../../../redux/app/actions/index';
import {hashHistory} from 'react-router';
// import {hashHistory, Link} from 'react-router';
import {IUser, ITaskActivity} from 'api/interfaces';
import {differenceBy} from 'lodash';
// import TimeUtiles from 'services/utils/time';
import {setCurrentAttachment, setCurrentAttachmentList} from 'redux/attachment/actions/index';
import {ActivitiyItem} from './ActivitiyItem';

const style = require('../../task.css');
const styleNavbar = require('../../../../../components/navbar/navbar.css');
const privateStyle = require('../../../private.css');

/**
 * @interface IOwnProps
 * @desc The component owned properties
 */
interface IOwnProps {
  task?: ITask;
  routeParams?: any;
}

/**
 * @interface IProps
 * @desc The component properties including the owned and the props are provided by route and redux
 */
interface IProps {
  /**
   * @prop post
   * @desc A post model
   * @type {IPost}
   * @memberof IProps
   */
  currentTask: ITask;
  /**
   * @prop posts
   * @desc The stored posts which are given by redux
   * @type {IPost[]}
   * @memberof IProps
   */
  tasks: ITask[];
  /**
   * @prop routeParams
   * @desc The parameters which are provided by React Router
   * @type {*}
   * @memberof IProps
   */
  routeParams: any;
  /**
   * @prop setPosts
   * @desc Updates posts in store
   * @memberof IProps
   */
  setTasks: (posts: ITask[]) => {};
  /**
   * @prop setCurrentPost
   * @desc Updates the last post in store
   * @memberof IProps
   */
  setCurrentTask: (post: ITask) => {};
  setCurrentAttachment: (attachment) => void;
  setCurrentAttachmentList: (attachments) => void;
  /**
   * @prop user
   * @desc Current loggedin user
   * @memberof IProps
   */
  user: IUser;
  location: any;
}

/**
 * @interface IState
 * @desc Interface of the component state
 */
interface IState {
  /**
   * @prop post
   * @memberof IState
   */
  activities: ITaskActivity[];
  Loading: boolean;
  reachedTheEnd: boolean;
}

/**
 * @class EditTask
 * @extends {React.Component<IProps, IState>}
 * @desc A task-viw component
 */
class TaskActivities extends React.Component<IProps, IState> {
  private TaskApi: TaskApi;
  private pagination: any = {
    skip: 0,
    limit: 20,
  };

  /**
   * Creates an instance of Post.
   * @param {IProps} props
   * @memberof Post
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      activities: [],
      Loading: false,
      reachedTheEnd: false,
    };
  }

  /**
   * @function componentDidMount
   * @desc Uses the provided post in props or asks server to get the post by
   * the given `postId` parameter in route also Marks the post as read.
   * @memberof Post
   * @override
   */
  public componentDidMount() {
    this.TaskApi = new TaskApi();
    this.getActivities();
  }
  private getActivities = () => {
    this.TaskApi.getActivities({
      limit: this.pagination.limit,
      skip: this.pagination.skip,
      details: true,
      only_comments: false,
      task_id: this.props.routeParams.taskId,
    })
    .then((activities: ITaskActivity[]) => {
      const reachedTheEnd = activities.length < this.pagination.limit;
      const newItems = differenceBy(activities, this.state.activities, '_id');
      this.pagination.skip += activities.length;
      this.setState({
        activities: [...this.state.activities, ...newItems],
        reachedTheEnd,
      });
    });

  }

  /**
   * @func leave
   * @desc Routes to the previous page
   * @private
   * @memberof EditTask
   */
  private leave = () => {
    hashHistory.goBack();
  }

  private refresh = () => {
    this.pagination = {
      limit: 30,
      skip: 0,
    };
    this.getActivities();
  }

  public openAttachment = (attachment) => {
    // this.props.setCurrentTask(this.props.task);
    this.props.setCurrentAttachment(attachment);
    this.props.setCurrentAttachmentList([attachment]);
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof Post
   * @generator
   */
  public render() {
    if (this.state.Loading) {
      return <Loading active={true} position="absolute"/>;
    }
    return (
      <div className={[style.taskView].join(' ')}>
        <div className={styleNavbar.navbar}>
          <a onClick={this.leave}>
            <IcoN size={24} name="xcross24"/>
          </a>
          <h1>Task Activity</h1>
          <div className={styleNavbar.filler}/>
        </div>
        <InfiniteScroll
            pullDownToRefresh={true}
            refreshFunction={this.refresh}
            next={this.getActivities}
            route={this.props.location.pathname}
            hasMore={!this.state.reachedTheEnd}
            loader={<Loading active={!this.state.reachedTheEnd} position="fixed"/>}>
          {this.state.activities.map((activity) =>
            (
              <div key={activity._id}>
                <ActivitiyItem activity={activity}/>
              </div>
            ))}
          <div className={privateStyle.bottomSpace}/>
        </InfiniteScroll>
      </div>
    );
  }
}

/**
 * @const mapStateToProps
 * @desc Provides the required parts of store through the component props
 * @param {any} store
 * @param {IOwnProps} ownProps
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  currentTask: store.app.currentTask,
  user: store.app.user,
  routeParams: ownProps.routeParams,
});

/**
 * @desc Provides the actions that updates store through the component props
 * @const mapDispatchToProps
 * @param {any} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  setCurrentTask: (task: ITask) => (dispatch(setCurrentTask(task))),
  setCurrentAttachment: (attach) => {
    dispatch(setCurrentAttachment(attach));
  },
  setCurrentAttachmentList: (attachs) => {
    dispatch(setCurrentAttachmentList(attachs));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskActivities);

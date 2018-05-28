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
import {IcoN, Loading, Scrollable, AddLabel, RTLDetector, TaskIcon,
  UserAvatar, FullName} from 'components';
import TaskApi from '../../../../../api/task/index';
import {connect} from 'react-redux';
import {setCurrentTask, setTasks} from '../../../../../redux/app/actions/index';
import {hashHistory, Link} from 'react-router';
import IUser from 'api/interfaces/IUser';
import C_TASK_STATUS from 'api/consts/CTaskStatus';
import statuses from 'api/consts/CTaskProgressTask';
import {difference} from 'lodash';

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
  task: ITask;
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
  /**
   * @prop user
   * @desc Current loggedin user
   * @memberof IProps
   */
  user: IUser;
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
  task?: ITask | null;
  /**
   * @prop showMoreOptions
   * @memberof IState
   */
  showMoreOptions: boolean;
  /**
   * @prop showAddLabel
   * @memberof IState
   */
  showAddLabel: boolean;
}

/**
 * @class EditTask
 * @extends {React.Component<IProps, IState>}
 * @desc A task-viw component
 */
class EditTask extends React.Component<IProps, IState> {
  private TaskApi: TaskApi;
  /**
   * define inProgress flag
   * @property {boolean} inProgress
   * @memberof Post
   */
  private inProgress: boolean;
  private scrollRef: any;
  private subjectRtl: boolean;
  private descriptionRtl: boolean;

  /**
   * Creates an instance of Post.
   * @param {IProps} props
   * @memberof Post
   */
  constructor(props: IProps) {
    super(props);
    this.inProgress = false;
    this.state = {
      task: this.props.task,
      showMoreOptions: false,
      showAddLabel: false,
    };
  }

  private doneAddLabel = (labels) => {
    const removeItems = difference(this.state.task.labels, labels);
    const addItems = difference(labels, this.state.task.labels);
    this.toggleAddLAbel();
    removeItems.forEach((element) => {
      this.removeLabel(element._id);
    });
    addItems.forEach((element) => {
      this.addLabel(element._id);
    });
    const task: ITask = this.state.task;
    task.labels = labels;
    this.setState({
        task,
    });
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
    if (this.props.task) {

      this.subjectRtl = RTLDetector.getInstance().direction(this.props.task.title);
      this.descriptionRtl = RTLDetector.getInstance().direction(this.props.task.description);

      this.setState({
        task: this.props.task ? this.props.task : null,
      });
    } else {
      this.TaskApi.getMany(this.props.routeParams.taskId)
        .then((response) => {
          this.setState({
            task: response.tasks[0],
          });
        });
      // scroll top to clear previous page scroll
      window.scrollTo(0, 0);
    }
  }

  private removeLabel(id: string) {
    this.TaskApi.removeLabel(this.state.task._id, id);
  }

  private addLabel(id: string) {
    this.TaskApi.addLabel(this.state.task._id, id);
  }

  private toggleAddLAbel = () => {
    this.setState({
      showMoreOptions: false,
      showAddLabel: !this.state.showAddLabel,
    });
  }

  /**
   * @function componentWillUnmount
   * remove event listeners on this situation
   * @override
   * @memberOf Post
   */
  public componentWillUnmount() {
    // this.htmlBodyRef.removeEventListener('DOMSubtreeModified');
  }

  public newCommentReceived = () => {
    this.scrollRef.scrollDown();
  }

  /**
   * @func componentWillReceiveProps
   * @desc Replaces the post in the component state with the new post in received props
   * @param {IProps} newProps
   * @memberof Post
   * @override
   */
  public componentWillReceiveProps(newProps: IProps) {
    if (this.props.task) {
      this.setState({
        task: newProps.task ? newProps.task : null,
      });
    }
  }

  // /**
  //  * @func updatePostsInStore
  //  * @desc Updates a post property and replaces the post in store's posts
  //  * @private
  //  * @param {string} key
  //  * @param {*} value
  //  * @memberof Post
  //  */
  // private updateTasksInStore(key: string, value: any) {

  //   const tasks = JSON.parse(JSON.stringify(this.props.tasks));
  //   let newTasks;
  //   newTasks = tasks.map((task: ITask) => {
  //     if (task._id === this.state.task._id) {
  //       task[key] = value;
  //     }
  //     return task;
  //   });

  //   this.props.setTasks(newTasks);

  //   if (this.props.currentTask) {
  //     this.props.setCurrentTask(this.props.currentTask);
  //   }
  // }

  /**
   * @func leave
   * @desc Routes to the previous page
   * @private
   * @memberof EditTask
   */
  private leave() {
    hashHistory.goBack();
  }

  private toggleMoreOpts = () => {
    this.setState({
      showMoreOptions: !this.state.showMoreOptions,
    });
  }

  private scrollRefHandler = (value) => {
    this.scrollRef = value;
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof Post
   * @generator
   */
  public render() {
    const taskView = !this.props.task;
    if (!this.state.task) {
      return <Loading active={true} position="absolute"/>;
    }

    const {task} = this.state;
    const isHold = this.state.task.status === C_TASK_STATUS.HOLD;
    const isCompleted = this.state.task.status === C_TASK_STATUS.COMPLETED;
    const isFailed = this.state.task.status === C_TASK_STATUS.FAILED;
    const isInProgress = !(isHold || isCompleted || isFailed);
    // Checks the sender is external mail or not
    return (
      <div className={[style.taskView, !this.props.task ? style.postView : null].join(' ')}>
        {/* specefic navbar for post view */}
        {taskView && (
          <div className={styleNavbar.navbar}>
            <a onClick={this.leave}>
              <IcoN size={24} name="xcross24"/>
            </a>
            <div className={styleNavbar.filler}/>
            <a onClick={this.toggleMoreOpts}>
              <IcoN size={24} name="more24"/>
            </a>
          </div>
        )}
        {this.state.showMoreOptions && (
          <div className={[style.postOptions, style.opened].join(' ')}>
            <ul>
              <li className={isInProgress ? 'active' : ''}>
                <IcoN size={16} name={'taskInProgress16'}/>
                <Link to={`/forward/${task._id}`}>In Progress</Link>
              </li>
              <li className={isHold ? 'active' : ''}>
                <IcoN size={16} name={'taskHold16'}/>
                <Link to={`/forward/${task._id}`}>Hold</Link>
              </li>
              <li className={isCompleted ? 'active' : ''}>
                <IcoN size={16} name={'taskCompleted16'}/>
                <Link to={`/forward/${task._id}`}>Completed</Link>
              </li>
              <li className={isFailed ? 'active' : ''}>
                <IcoN size={16} name={'failed16'}/>
                <Link to={`/forward/${task._id}`}>Failed</Link>
              </li>
              <li className={style.hr}/>
              <li>
                <IcoN size={16} name={'chain16'}/>
                <Link to={`/forward/${task._id}`}>Create a related Task</Link>
              </li>
              <li>
                <IcoN size={16} name={'bin16'}/>
                <Link to={`/forward/${task._id}`}>Delete</Link>
              </li>
            </ul>
          </div>
        )}
        {this.state.showMoreOptions &&
          <div onClick={this.toggleMoreOpts} className={style.overlay}/>
        }
        <Scrollable active={true} ref={this.scrollRefHandler}>
          <div className={style.postScrollContainer}>
            <div className={style.postScrollContent}>
              <div className={style.taskRow}>
                <div className="task-row-icon">
                  <TaskIcon status={statuses.ASSIGNED_CHECKLIST} progress={this.state.task.progress}/>
                </div>
                <div className="task-row-item">
                  {task.title}
                </div>
              </div>
              <div className={style.taskRow}>
                <div className="task-row-icon">
                  {task.assignee && <UserAvatar user_id={task.assignee._id} borderRadius="24px" size={24}/>}
                  {!task.assignee && <IcoN name="askWire24" size={24}/>}
                  {task.candidates && <IcoN name="candidate32" size={32}/>}
                </div>
                <div className="task-row-item">
                  Assigned to <b> <FullName user_id={task.assignee._id} /></b>
                  Candidates: {task.candidates.map((user) => <b>{user.fullName}</b>)}
                </div>
              </div>
              <div className={style.taskRow}>
                <div className="task-row-icon">
                  <IcoN name="bulletList16" size={16}/>
                </div>
                <div className="task-row-item">
                  <h4>To-Do List</h4>
                  <ul>
                    <li>first</li>
                  </ul>
                </div>
              </div>
              {task.description}
              {/* {!this.props.post && (
                <CommentsBoard no_comment={this.state.post.no_comment}
                post_id={this.state.post._id} post={this.state.post}
                user={this.props.user}/>
              )} */}
            {taskView && <div className={privateStyle.bottomSpace}/>}
            </div>
          </div>
        </Scrollable>
        {this.state.showAddLabel && (
          <AddLabel labels={task.labels} onDone={this.doneAddLabel} onClose={this.toggleAddLAbel}/>
        )}
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
  task: ownProps.task,
  currentTask: store.app.currentTask,
  tasks: store.app.tasks,
  user: store.app.user,
  routeParams: ownProps.routeParams,
});

/**
 * @desc Provides the actions that updates store through the component props
 * @const mapDispatchToProps
 * @param {any} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  setTasks: (tasks: ITask[]) => (dispatch(setTasks(tasks))),
  setCurrentTask: (task: ITask) => (dispatch(setCurrentTask(task))),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTask);
